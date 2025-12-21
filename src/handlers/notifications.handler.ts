import _ from "lodash";
import { Request, Response } from "express-serve-static-core";
import convert from "@/utils/convert";
import NotificationService from "@/services/notifications.service";

export async function getNotifications(req: Request, res: Response) {
  const { page, limit, ids, receiver_id } = req.query;

  const { data: notifications, pagination } = await NotificationService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
    ids: convert.split(ids as string, ",", Number),
    receiver_id: _.toInteger(receiver_id)
  });

  res.status(200).json({
    success: true,
    data: notifications,
    pagination,
  });
}
