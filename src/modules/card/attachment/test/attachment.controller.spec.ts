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
import { AttachmentController } from '../attachment.controller';
import { AttachmentService } from '../attachment.service';
import { Attachment } from '@modules/card/entity/child-entity/attachment.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './attachment.mock';
import {
  AttachmentDto,
  SyncAttachmentDto,
} from '@modules/card/dto/attachment.dto';

describe('AttachmentController', () => {
  let attachmentController: AttachmentController;
  let attachmentService: AttachmentService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Attachment]),
      ],
      controllers: [AttachmentController],
      providers: [AttachmentService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    attachmentController =
      module.get<AttachmentController>(AttachmentController);
    attachmentService = module.get<AttachmentService>(AttachmentService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(attachmentService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of attachments', async () => {
      const mockAttachments = [new Attachment(), new Attachment()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      attachmentService.getAll = jest.fn().mockReturnValue(mockAttachments);

      const result = await attachmentController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(attachmentService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced attachments', async () => {
      const mockSyncedAttachments: SyncAttachmentDto[] = [
        new SyncAttachmentDto(new Attachment()),
      ];
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
            files: [],
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(attachmentService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedAttachments, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedAttachments.length,
        }),
      );

      const result = await attachmentController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an attachment by ID', async () => {
      const mockAttachmentId = new ObjectId();
      const mockAttachment = new AttachmentDto(new Attachment());
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(attachmentService, 'getOne').mockResolvedValue(mockAttachment);
      const result = await attachmentController.getOneById(mockAttachmentId);
      expect(result).toEqual(mockAttachment);
    });

    it('should throw NotFoundException when attachment is not found', async () => {
      const mockAttachmentId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(attachmentService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(attachmentService, 'getOne').mockResolvedValue(null);

      try {
        await attachmentController.getOneById(mockAttachmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Attachment ${mockAttachmentId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create attachment', () => {
    it('should create an attachment', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockAttachment = new Attachment();
      jest
        .spyOn(attachmentService, 'saveAttachment')
        .mockResolvedValue(mockAttachment);
      const payload = new AttachmentDto(new Attachment());
      const result = await attachmentController.createAttachment(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(attachmentService.saveAttachment).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockAttachment);
    });
  });

  describe('Update attachment', () => {
    it('should update an attachment', async () => {
      const objectId = new ObjectId();
      const mockAttachment = new Attachment();
      mockAttachment.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(attachmentService, 'saveAttachment')
        .mockResolvedValue(mockAttachment);
      const payload = new AttachmentDto(new Attachment());
      const result = await attachmentController.updateAttachment(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(attachmentService.saveAttachment).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete attachment by Id', () => {
    it('should soft delete an attachment', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(attachmentService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Attachment()));
      attachmentService.softDeleteCard = jest.fn();
      await attachmentController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(attachmentService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.ATTACHMENTS,
      );
    });
  });
});
