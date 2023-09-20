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
import { AttachmentService } from '../attachment.service';
import { Attachment } from '@modules/card/entity/child-entity/attachment.entity';
import {
  attachmentData,
  attachmentPayload,
  createAttachmentPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './attachment.mock';
import { SyncAttachmentDto } from '@modules/card/dto/attachment.dto';

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;
  let attachmentRepository: Repository<Attachment>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Attachment]),
      ],
      providers: [AttachmentService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    attachmentService = module.get<AttachmentService>(AttachmentService);
    attachmentRepository = module.get<Repository<Attachment>>(
      getRepositoryToken(Attachment),
    );
    await dataSource.getMongoRepository(Attachment).insertMany(attachmentData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await attachmentRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(attachmentService).toBeDefined();
  });

  describe('saveAttachment', () => {
    it('should create and save a new attachment when id is not provided', async () => {
      const countBefore = await attachmentRepository.count();
      const result = await attachmentService.saveAttachment(
        mockProfile,
        createAttachmentPayload,
      );
      const countAfter = await attachmentRepository.count();
      expect(result._id).toEqual(createAttachmentPayload._id);
      expect(result.isFollowedUp).toBe(createAttachmentPayload.isFollowedUp);
      expect(result.description).toBe(createAttachmentPayload.description);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but attachment already exist', async () => {
      try {
        await attachmentService.saveAttachment(mockProfile, attachmentPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Attachment ${attachmentPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing attachment when id is provided', async () => {
      const attachmentId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await attachmentService.saveAttachment(
        mockProfile,
        attachmentPayload,
        attachmentId,
      );
      expect(result._id).toEqual(attachmentId);
      expect(result.isFollowedUp).toEqual(attachmentPayload.isFollowedUp);
      expect(result.description).toEqual(attachmentPayload.description);
      expect(result.title).toEqual(attachmentPayload.title);
    });

    it('should throw BadRequestException when id is provided but attachment does not exist', async () => {
      const mockAttachmentId = new ObjectId();
      try {
        await attachmentService.saveAttachment(
          mockProfile,
          attachmentPayload,
          mockAttachmentId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Attachment ${mockAttachmentId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of attachments', async () => {
      const attachments = await attachmentRepository.find();
      const count = await attachmentRepository.count();

      const result = await attachmentService.getAll(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of attachments', async () => {
      const attachments = await attachmentRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.ATTACHMENTS,
        },
      });
      const filteredAttachments = attachments.filter(
        (attachment) =>
          attachment.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await attachmentService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncAttachments = filteredAttachments.map(
        (attachment) => new SyncAttachmentDto(attachment),
      );
      expect(result.result).toEqual(syncAttachments);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an attachment if it exists', async () => {
      const mockAttachmentId = new ObjectId('650156e338b8a56d37856604');

      const attachment = await attachmentRepository.findOne({
        where: {
          _id: mockAttachmentId,
          profile: mockProfile._id,
          cardType: CardType.ATTACHMENTS,
          deletedTime: null,
        },
      });

      const result = await attachmentService.getOne(
        mockProfile,
        mockAttachmentId,
      );

      expect(result._id).toEqual(attachment._id);
      expect(result.description).toEqual(attachment.description);
      expect(result.title).toEqual(attachment.title);
    });

    it('should throw NotFoundException if attachment does not exist', async () => {
      const mockAttachmentId = new ObjectId();
      try {
        await attachmentService.getOne(mockProfile, mockAttachmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Attachment ${mockAttachmentId} does not exist`,
        );
      }
    });
  });
});
