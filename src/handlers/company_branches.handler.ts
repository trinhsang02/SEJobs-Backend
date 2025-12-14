import { createCompanyBranchSchema } from "@/dtos/company/CreateCompanyBranch.dto";
import CompanyBranchesService from "@/services/company_branches.service";
import convert from "@/utils/convert";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import _ from "lodash";

export async function getCompanyBranches(req: Request, res: Response) {
    const { page, limit } = req.query;

    const { data: branches, pagination } = await CompanyBranchesService.findAll({
        ...req.query,
        page: _.toInteger(page) || 1,
        limit: _.toInteger(limit) || 10,
        fields: req.query.fields as string,
        ids: convert.split(req.query.ids as string, ',', Number),
    });

    res.status(200).json({
        success: true,
        data: branches,
        pagination,
    });
}

export async function getCompanyBranch(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
        throw new Error('Missing required param: id');
    }

    const branch = await CompanyBranchesService.findOne({ id: _.toNumber(id) });

    res.status(200).json({
        success: true,
        data: branch,
    });
}

export async function createBranch(req: Request, res: Response) {
    const branchData = validate.schema_validate(createCompanyBranchSchema, req.body);

    const newBranch = await CompanyBranchesService.createBranch({ branchData });

    res.status(201).json({
        success: true,
        data: newBranch,
    });
}

export async function updateBranch(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
        throw new Error('Missing required param: id');
    }

    const updatedBranch = await CompanyBranchesService.updateBranch({ branchId: _.toNumber(id), branchData: req.body });

    res.status(200).json({
        success: true,
        data: updatedBranch,
    });
}

export async function deleteBranch(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
        throw new Error('Missing required param: id');
    }

    await CompanyBranchesService.delete(_.toNumber(id));

    res.status(200).json({
        success: true,
    });
}