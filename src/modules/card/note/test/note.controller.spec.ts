import { ClsService } from 'nestjs-cls';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PROFILE_TOKEN } from '@constant';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { closeMongoConnection, initialTypeOrm } from '@test';
import { CardType } from '@enum';
import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';
import { Note } from '@modules/card/entity/child-entity/note.entity';
import { mockPageRequest, mockPageRequestSync, mockProfile } from './note.mock';
import { SaveNoteDto, SyncNoteDto } from '@modules/card/dto/note.dto';

describe('NoteController', () => {
  let noteController: NoteController;
  let noteService: NoteService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Note])],
      controllers: [NoteController],
      providers: [NoteService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    noteController = module.get<NoteController>(NoteController);
    noteService = module.get<NoteService>(NoteService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(noteService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of notes', async () => {
      const mockNotes = [new Note(), new Note()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      noteService.getAll = jest.fn().mockReturnValue(mockNotes);

      const result = await noteController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(noteService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockNotes);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced notes', async () => {
      const mockSyncedNotes: SyncNoteDto[] = [new SyncNoteDto(new Note())];
      const mockExpectedPageable = {
        hasNextPage: false,
        hasPreviousPage: false,
        itemCount: 1,
        page: 1,
        pageCount: 1,
        result: [
          {
            __v: 0,
            deletedTime: null,
            isFollowedUp: false,
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(noteService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedNotes, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedNotes.length,
        }),
      );

      const result = await noteController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an note by ID', async () => {
      const mockNoteId = new ObjectId();
      const mockNote = new Note();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(noteService, 'getOne').mockResolvedValue(mockNote);
      const result = await noteController.getOneById(mockNoteId);
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException when note is not found', async () => {
      const mockNoteId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(noteService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(noteService, 'getOne').mockResolvedValue(null);

      try {
        await noteController.getOneById(mockNoteId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `note ${mockNoteId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create note', () => {
    it('should create an note', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockNote = new Note();
      jest.spyOn(noteService, 'saveNote').mockResolvedValue(mockNote);
      const payload = new SaveNoteDto();
      const result = await noteController.createNote(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(noteService.saveNote).toHaveBeenCalledWith(mockProfile, payload);
      expect(result).toEqual(mockNote);
    });
  });

  describe('Update note', () => {
    it('should update an note', async () => {
      const objectId = new ObjectId();
      const mockNote = new Note();
      mockNote.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(noteService, 'saveNote').mockResolvedValue(mockNote);
      const payload = new SaveNoteDto({
        isNoLongerExperiencing: false,
      });
      const result = await noteController.updateNote(objectId, payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(noteService.saveNote).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete note by Id', () => {
    it('should soft delete an note', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(noteService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Note()));
      noteService.softDeleteCard = jest.fn();
      await noteController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(noteService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.NOTES,
      );
    });
  });
});
