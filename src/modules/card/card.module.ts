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
import { PractitionerController } from './practititioner/practitioner.controller';
import { PractitionerService } from './practititioner/practitioner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, Allergy, Practitioner, Attachment]),
    ProfileModule,
  ],
  controllers: [
    CardController,
    NoteController,
    AllergyController,
    PractitionerController,
    AttachmentController,
  ],
  providers: [
    NoteService,
    AllergyService,
    PractitionerService,
    AttachmentService,
  ],
})
export class CardModule {}
