import { createExperienceSchema, updateExperienceSchema } from "@/dtos/student/Experiences.dto";
import experiencesService from "@/services/experiences.service";
import { BadRequestError } from "@/utils/errors";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import _ from "lodash";


export async function getExperiences(req: Request, res: Response) {
    const { page, limit } = req.query;
    const { data, pagination} = await experiencesService.findAll({
        page: _.toInteger(page) || 1,
        limit: _.toInteger(limit) || 10,
    });

    res.status(200).json({
        success: true,
        data: data,
        pagination: pagination,
    });
}

export async function getExperienceById(req: Request, res: Response) {
    const id = _.toNumber(req.params.id);

    if (!id) {
      throw new BadRequestError({ message: 'Missing required param: id'});
    }

    const data = await experiencesService.findOne(id);

    if (!data) {
      throw new BadRequestError({ message: `Experience with ID ${id} not found` });
    }

    res.status(200).json({
        success: true,
        data: data,
    });
}

export async function createExperience(req: Request, res: Response) {
    const userData = validate.schema_validate(createExperienceSchema, req.body);
    const newExperience = await experiencesService.create(userData);

    res.status(201).json({
        success: true,
        data: newExperience,
    });
}

export async function updateExperience(req: Request, res: Response) {
    const id = _.toNumber(req.params.id);
    if (!id) {
      throw new BadRequestError({ message: 'Missing required param: id'});
    }
    const userData = validate.schema_validate(updateExperienceSchema, req.body);
    const updatedExperience = await experiencesService.update({ id, data: userData });

    res.status(200).json({
        success: true,
        data: updatedExperience,
    });
}

export async function deleteExperience(req: Request, res: Response) {
    const id = _.toNumber(req.params.id);
    if (!id) {
      throw new BadRequestError({ message: 'Missing required param: id'});
    }
    await experiencesService.delete(id);

    res.status(200).json({
        success: true,
    });
}