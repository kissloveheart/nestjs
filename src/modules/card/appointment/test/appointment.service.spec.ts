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
import { AppointmentService } from '../appointment.service';
import { Appointment } from '@modules/card/entity/child-entity/appointment.entity';
import {
  appointmentData,
  appointmentPayload,
  createAppointmentPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './appointment.mock';
import { SyncAppointmentDto } from '@modules/card/dto/appointment.dto';

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  let appointmentRepository: Repository<Appointment>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Appointment]),
      ],
      providers: [AppointmentService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    appointmentService = module.get<AppointmentService>(AppointmentService);
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
    await dataSource
      .getMongoRepository(Appointment)
      .insertMany(appointmentData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await appointmentRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(appointmentService).toBeDefined();
  });

  describe('saveAppointment', () => {
    it('should create and save a new appointment when id is not provided', async () => {
      const countBefore = await appointmentRepository.count();
      const result = await appointmentService.saveAppointment(
        mockProfile,
        createAppointmentPayload,
      );
      const countAfter = await appointmentRepository.count();
      expect(result._id).toEqual(createAppointmentPayload._id);
      expect(result.isFollowedUp).toBe(createAppointmentPayload.isFollowedUp);
      expect(result.location).toBe(createAppointmentPayload.location);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but Appointment already exist', async () => {
      try {
        await appointmentService.saveAppointment(
          mockProfile,
          appointmentPayload,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Appointment ${appointmentPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing Appointment when id is provided', async () => {
      const appointmentId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await appointmentService.saveAppointment(
        mockProfile,
        appointmentPayload,
        appointmentId,
      );
      expect(result._id).toEqual(appointmentId);
      expect(result.isFollowedUp).toEqual(appointmentPayload.isFollowedUp);
      expect(result.location).toEqual(appointmentPayload.location);
    });

    it('should throw BadRequestException when id is provided but Appointment does not exist', async () => {
      const mockAppointmentId = new ObjectId();
      try {
        await appointmentService.saveAppointment(
          mockProfile,
          appointmentPayload,
          mockAppointmentId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Appointment ${mockAppointmentId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of appointments', async () => {
      const appointments = await appointmentRepository.find();
      const count = await appointmentRepository.count();

      const result = await appointmentService.getAll(
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
    it('should return a Pageable of appointments', async () => {
      const appointments = await appointmentRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.APPOINTMENTS,
        },
      });
      const filteredAppointments = appointments.filter(
        (appointment) =>
          appointment.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await appointmentService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncAppointments = filteredAppointments.map(
        (appointment) => new SyncAppointmentDto(appointment),
      );
      expect(result.result).toEqual(syncAppointments);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an appointment if it exists', async () => {
      const mockAppointmentId = new ObjectId('650156e338b8a56d37856604');

      const appointment = await appointmentRepository.findOne({
        where: {
          _id: mockAppointmentId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.APPOINTMENTS,
        },
      });

      const result = await appointmentService.getOne(
        mockProfile,
        mockAppointmentId,
      );

      expect(result).toEqual(appointment);
    });

    it('should throw NotFoundException if appointment does not exist', async () => {
      const mockAppointmentId = new ObjectId();
      try {
        await appointmentService.getOne(mockProfile, mockAppointmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Appointment ${mockAppointmentId} does not exist`,
        );
      }
    });
  });
});
