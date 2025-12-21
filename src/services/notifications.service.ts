import notificationRepository from "@/repositories/notifications.repository";
import { NotificationInsert, NotificationQueryAll, NotificationType } from "@/types/common";
import { BadRequestError } from "@/utils/errors";
import validate from "@/utils/validate";
import _ from "lodash";

export class NotificationService {
  async findAll(input: NotificationQueryAll) {
    return await notificationRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await notificationRepository.findOne(input.id);
  }

  async create(input: { data: NotificationInsert }) {
    const { data } = input;

    const notification_type = _.get(data, 'type');

    if (!validate.valid_enum(NotificationType, notification_type)) {
        throw new BadRequestError({ message: "Invalid notification type!" });
    }

    return await notificationRepository.create({
      data: data,
    });
  }

  async delete(id: number) {
    return await notificationRepository.delete(id);
  }
}

export default new NotificationService();
