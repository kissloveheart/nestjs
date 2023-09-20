import { ProfileModule } from '@modules/profile';
import { Module, forwardRef } from '@nestjs/common';
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
import { VaccinationService } from './vaccination/vaccination.service';
import { ProcedureService } from './procedure/procedure.service';
import { QuestionService } from './question/question.service';
import { IDCardController } from './id-card/id-card.controller';
import { IDCardService } from './id-card/id-card.service';
import { Card } from './entity/card.entity';
import { CardService } from './card.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Card,
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
    FileModule,
    forwardRef(() => ProfileModule),
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
    CardService,
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
  exports: [CardService],
})
export class CardModule {}
