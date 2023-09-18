import { ProfileModule } from '@modules/profile';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllergyController } from './allergy/allergy.controller';
import { AllergyService } from './allergy/allergy.service';
import { AttachmentController } from './attachment/attachment.controller';
import { AttachmentService } from './attachment/attachment.service';
import { CardController } from './card.controller';
import { Allergy } from './entity/child-entity/allergy.entity';
import { Attachment } from './entity/child-entity/attachment.entity';
import { Note } from './entity/child-entity/note.entity';
import { Practitioner } from './entity/child-entity/practitioner.entity';
import { NoteController } from './note/note.controller';
import { NoteService } from './note/note.service';
import { PractitionerController } from './practitioner/practitioner.controller';
import { PractitionerService } from './practitioner/practitioner.service';
import { AppointmentService } from './appointment/appointment.service';
import { AppointmentController } from './appointment/appointment.controller';
import { Appointment } from './entity/child-entity/appointment.entity';
import { ConditionService } from './condition/condition.service';
import { ConditionController } from './condition/condition.controller';
import { Condition } from './entity/child-entity/condition.entity';
import { FileModule } from '@modules/file';
import { Hospitalization } from './entity/child-entity/hospitalization.entity';
import { HospitalizationController } from './hospitalization/hospitalization.controller';
import { HospitalizationService } from './hospitalization/hospitalization.service';
import { Medication } from './entity/child-entity/medication.entity';
import { MedicationController } from './medication/medication.controller';
import { MedicationService } from './medication/medication.service';
import { Vaccination } from './entity/child-entity/vaccination.entity';
import { Question } from './entity/child-entity/question.entity';
import { Procedure } from './entity/child-entity/procedure.entity';
import { QuestionController } from './question/question.controller';
import { ProcedureController } from './procedure/procedure.controller';
import { VaccinationController } from './vaccination/vaccination.controller';
import { IDCard } from './entity/child-entity/idCard.entity';
import { IDCardController } from './id-card/idCard.controller';
import { IDCardService } from './id-card/idCard.service';
import { VaccinationService } from './vaccination/vaccination.service';
import { ProcedureService } from './procedure/procedure.service';
import { QuestionService } from './question/question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Note,
      Allergy,
      Practitioner,
      Attachment,
      Appointment,
      Condition,
      Hospitalization,
      Vaccination,
      Question,
      Procedure,
      Medication,
      IDCard,
    ]),
    ProfileModule,
    FileModule,
  ],
  controllers: [
    CardController,
    NoteController,
    AllergyController,
    PractitionerController,
    AttachmentController,
    AppointmentController,
    ConditionController,
    HospitalizationController,
    MedicationController,
    QuestionController,
    ProcedureController,
    VaccinationController,
    IDCardController,
  ],
  providers: [
    NoteService,
    AllergyService,
    PractitionerService,
    AttachmentService,
    AppointmentService,
    ConditionService,
    HospitalizationService,
    MedicationService,
    IDCardService,
    VaccinationService,
    ProcedureService,
    QuestionService,
  ],
})
export class CardModule {}
