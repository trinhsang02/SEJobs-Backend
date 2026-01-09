import studentRepository from "@/repositories/student.repository";
import { StudentQueryAllParams } from "@/types/common";
import { NotFoundError } from "@/utils/errors";

export class StudentService {
    async findAll(input: StudentQueryAllParams) {
        const students = await studentRepository.findAll(input);

        return students;
    }

    async findOne(input: { student_id: number }) {
        const { student_id } = input;

        const student = await studentRepository.findOne({ student_id });

        if (!student) {
            throw new NotFoundError({ message: `Student with ID ${student_id} not found` });
        }
        return student;
    }
}

export default new StudentService();