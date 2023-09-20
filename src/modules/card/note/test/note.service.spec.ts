import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Pageable } from '@types';
import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CardType } from '@enum';
import { closeMongoConnection, initialTypeOrm } from '@test';
import { NoteService } from '../note.service';
import { Note } from '@modules/card/entity/child-entity/note.entity';
import {
  createNotePayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  noteData,
  notePayload,
} from './note.mock';
import { SyncNoteDto } from '@modules/card/dto/note.dto';

describe('NoteService', () => {
  let noteService: NoteService;
  let noteRepository: Repository<Note>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Note])],
      providers: [NoteService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    noteService = module.get<NoteService>(NoteService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
    await dataSource.getMongoRepository(Note).insertMany(noteData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await noteRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(noteService).toBeDefined();
  });

  describe('saveNote', () => {
    it('should create and save a new note when id is not provided', async () => {
      const countBefore = await noteRepository.count();
      const result = await noteService.saveNote(mockProfile, createNotePayload);
      const countAfter = await noteRepository.count();
      expect(result._id).toEqual(createNotePayload._id);
      expect(result.isFollowedUp).toBe(createNotePayload.isFollowedUp);
      expect(result.description).toBe(createNotePayload.description);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but note already exist', async () => {
      try {
        await noteService.saveNote(mockProfile, notePayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`Note ${notePayload._id} already exist`);
      }
    });

    it('should find and save an existing note when id is provided', async () => {
      const noteId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await noteService.saveNote(
        mockProfile,
        notePayload,
        noteId,
      );
      expect(result._id).toEqual(noteId);
      expect(result.isFollowedUp).toEqual(notePayload.isFollowedUp);
      expect(result.description).toEqual(notePayload.description);
    });

    it('should throw BadRequestException when id is provided but note does not exist', async () => {
      const mockNoteId = new ObjectId();
      try {
        await noteService.saveNote(mockProfile, notePayload, mockNoteId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(`Note ${mockNoteId} does not exist`);
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of notes', async () => {
      const notes = await noteRepository.find();
      const count = await noteRepository.count();

      const result = await noteService.getAll(mockProfile, mockPageRequest);
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of notes', async () => {
      const notes = await noteRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.NOTES,
        },
      });
      const filteredNotes = notes.filter(
        (note) =>
          note.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await noteService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncNotes = filteredNotes.map((note) => new SyncNoteDto(note));
      expect(result.result).toEqual(syncNotes);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an note if it exists', async () => {
      const mockNoteId = new ObjectId('650156e338b8a56d37856604');

      const note = await noteRepository.findOne({
        where: {
          _id: mockNoteId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.NOTES,
        },
      });

      const result = await noteService.getOne(mockProfile, mockNoteId);

      expect(result).toEqual(note);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const mockNoteId = new ObjectId();
      try {
        await noteService.getOne(mockProfile, mockNoteId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Note ${mockNoteId} does not exist`);
      }
    });
  });
});
