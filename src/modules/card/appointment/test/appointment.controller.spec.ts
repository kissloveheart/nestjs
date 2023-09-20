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
import { Appointment } from '@modules/card/entity/child-entity/appointment.entity';
import { AppointmentController } from '../appointment.controller';
import { AppointmentService } from '../appointment.service';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './appointment.mock';
import {
  SaveAppointmentDto,
  SyncAppointmentDto,
} from '@modules/card/dto/appointment.dto';

describe('AppointmentController', () => {
  let appointmentController: AppointmentController;
  let appointmentService: AppointmentService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Appointment]),
      ],
      controllers: [AppointmentController],
      providers: [AppointmentService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    appointmentController = module.get<AppointmentController>(
      AppointmentController,
    );
    appointmentService = module.get<AppointmentService>(AppointmentService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(appointmentService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of appointments', async () => {
      const mockAppointments = [new Appointment(), new Appointment()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      appointmentService.getAll = jest.fn().mockReturnValue(mockAppointments);

      const result = await appointmentController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(appointmentService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockAppointments);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced appointments', async () => {
      const mockSyncedAppointments: SyncAppointmentDto[] = [
        new SyncAppointmentDto(new Appointment()),
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
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(appointmentService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedAppointments, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedAppointments.length,
        }),
      );

      const result =
        await appointmentController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an appointment by ID', async () => {
      const mockAppointmentId = new ObjectId();
      const mockAppointment = new Appointment();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(appointmentService, 'getOne')
        .mockResolvedValue(mockAppointment);
      const result = await appointmentController.getOneById(mockAppointmentId);
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException when appointment is not found', async () => {
      const mockAppointmentId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(appointmentService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(appointmentService, 'getOne').mockResolvedValue(null);

      try {
        await appointmentController.getOneById(mockAppointmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Appointment ${mockAppointmentId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create appointment', () => {
    it('should create an appointment', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockAppointment = new Appointment();
      jest
        .spyOn(appointmentService, 'saveAppointment')
        .mockResolvedValue(mockAppointment);
      const payload = new SaveAppointmentDto();
      const result = await appointmentController.createAppointment(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(appointmentService.saveAppointment).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('Update appointment', () => {
    it('should update an appointment', async () => {
      const objectId = new ObjectId();
      const mockAppointment = new Appointment();
      mockAppointment.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(appointmentService, 'saveAppointment')
        .mockResolvedValue(mockAppointment);
      const payload = new SaveAppointmentDto({
        isNoLongerExperiencing: false,
      });
      const result = await appointmentController.updateAppointment(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(appointmentService.saveAppointment).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete appointment by Id', () => {
    it('should soft delete an appointment', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(appointmentService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Appointment()));
      appointmentService.softDeleteCard = jest.fn();
      await appointmentController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(appointmentService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.APPOINTMENTS,
      );
    });
  });
});
