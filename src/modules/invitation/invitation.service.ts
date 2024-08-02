import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from 'src/database/entities/invitation.entity';
import { Repository } from 'typeorm';
import { PostInvitationDto } from './dto/post-invitation.dto';
import { UpdateInvitationDto } from './dto/patch-invitation.dto';
import { JobState } from 'src/enum/job-state.enum';
import { User } from 'src/database/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/enum/notification.enum';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationsService,
  ) {}

  async getInvitations(req) {
    const invitations = await this.invitationRepository.find({
      relations: { invitationOwner: true },
    });
    const user = await this.userRepository.findOneBy({
      id: req.currentUser.id,
    });
    const filteredInvitations: Invitation[] = [];

    for (let i = 0; i < invitations.length; i++) {
      invitations[i].invitationOwner.map((element) => {
        if (element.id === user.id) {
          filteredInvitations.push(invitations[i]);
        }
      });
    }
    return filteredInvitations;
  }

  async getOffers(req) {
    const offers = await this.invitationRepository.find({
      relations: { employee: true },
    });
    const user = await this.userRepository.findOneBy({
      id: req.currentUser.id,
    });
    const filteredOffers: Invitation[] = [];

    for (let i = 0; i < offers.length; i++) {
      offers[i].employee.map((element) => {
        if (element.id === user.id) {
          filteredOffers.push(offers[i]);
        }
      });
    }
    return filteredOffers;
  }

  async postInvitation(id: string, invitationData: PostInvitationDto, req) {
    const ownersArr: User[] = [];
    const employeesArr: User[] = [];
    const invitation = new Invitation();
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user)
      throw new NotFoundException(
        `User not found or not exist. Plis check the ID :${id}`,
      );

    ownersArr.push(req.currentUser);
    employeesArr.push(user);

    invitation.jobDescription = invitationData.jobDescription;
    invitation.payPerHour = invitationData.payPerHour;
    invitation.issue = invitationData.issue;
    invitation.location = invitationData.location;
    invitation.isRemote = invitationData.isRemote;
    invitation.startDate = invitationData.startDate;
    invitation.invitationOwner = ownersArr;
    invitation.employee = employeesArr;

    this.notificationService.postNotification(NotificationType.OFFER_JOB, user);
    await this.invitationRepository.save(invitation);

    return { message: 'The new invitation has been created', invitation };
  }

  async updateInvitation(id: string, invitationData: UpdateInvitationDto) {
    const invitationFounded: Invitation =
      await this.invitationRepository.findOneBy({
        id: id,
      });
    if (!invitationFounded)
      throw new NotFoundException(`The invitation was not found or not exist`);

    const update = this.invitationRepository.merge(
      invitationFounded,
      invitationData,
    );
    const invitation = await this.invitationRepository.save(update);
    return {
      message: 'Your job invitation has been modified successfully',
      invitation,
    };
  }

  async aceptOfferJob(id: string, req) {
    const user = await this.userRepository.findOneBy({
      id: req.currentUser.id,
    });
    const invitationFounded: Invitation =
      await this.invitationRepository.findOneBy({
        id: id,
      });

    if (!invitationFounded)
      throw new NotFoundException(`The offer job was not found or not exist`);

    this.notificationService.postNotification(
      NotificationType.ACEPTED_JOB,
      user,
    );
    invitationFounded.jobState = JobState.ACCEPTED;
    await this.invitationRepository.save(invitationFounded);
    return {
      message: 'The offer was acept successfullly',
      invitationFounded,
    };
  }
}
