import { Request, Response } from 'express';


// Helper to get models safely
const getModels = () => {
    return {
        Class: require('../models/Class').default,
        Student: require('../models/Student').default,
        SchoolYear: require('../models/SchoolYear').default
    };
};

export const getAllClasses = async (req: Request, res: Response) => {
    try {
        const { Class, Student } = getModels();

        const schoolYearId = req.headers['x-school-year-id'];

        if (!schoolYearId) {
            return res.status(400).json({ message: 'School Year ID is required' });
        }

        const classes = await Class.findAll({
            where: { school_year_id: schoolYearId },
            include: [{ model: Student, as: 'students' }]
        });
        res.json(classes);
    } catch (error: any) {
        console.error('getAllClasses ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getClassById = async (req: Request, res: Response) => {
    try {
        const { Class, Student } = getModels();
        const classe = await Class.findByPk(req.params.id, { include: [{ model: Student, as: 'students' }] });
        if (!classe) return res.status(404).json({ message: 'Class not found' });
        res.json(classe);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createClass = async (req: Request, res: Response) => {
    try {
        const { Class } = getModels();
        const schoolYearId = req.headers['x-school-year-id'];
        if (!schoolYearId) {
            return res.status(400).json({ message: 'School Year ID is required' });
        }

        const classe = await Class.create({
            ...req.body,
            title: req.body.libelle, // Legacy field requirement
            nom: req.body.libelle, // Legacy field requirement just in case
            school_year_id: schoolYearId
        });
        res.status(201).json(classe);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateClass = async (req: Request, res: Response) => {
    try {
        const { Class } = getModels();
        const classe = await Class.findByPk(req.params.id);
        if (!classe) return res.status(404).json({ message: 'Class not found' });
        await classe.update(req.body);
        res.json(classe);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteClass = async (req: Request, res: Response) => {
    try {
        const { Class } = getModels();
        const classe = await Class.findByPk(req.params.id);
        if (!classe) return res.status(404).json({ message: 'Class not found' });
        await classe.destroy();
        res.json({ message: 'Class deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const transferClasses = async (req: Request, res: Response) => {
    console.log('🔄 [Transfer] Request received:', req.body);
    try {
        const { Class, SchoolYear } = getModels();
        const { classIds, destYearId } = req.body;

        if (!classIds || !Array.isArray(classIds) || !destYearId) {
            console.error('❌ [Transfer] Invalid payload:', req.body);
            return res.status(400).json({ message: 'Invalid payload' });
        }

        // Fetch destination year to get the correct name string
        const destYear = await SchoolYear.findByPk(destYearId);
        if (!destYear) {
            console.error('❌ [Transfer] Destination year not found:', destYearId);
            return res.status(404).json({ message: 'Destination year not found' });
        }

        console.log(`✅ [Transfer] Host Year found: ${destYear.name} (ID: ${destYear.id})`);

        let transferCount = 0;
        let errors = [];

        for (const classId of classIds) {
            try {
                const sourceClass = await Class.findByPk(classId);
                if (sourceClass) {
                    // Check if class already exists in destination year to prevent duplicates
                    const existing = await Class.findOne({
                        where: {
                            libelle: sourceClass.libelle,
                            school_year_id: destYearId
                        }
                    });

                    if (existing) {
                        console.log(`⚠️ [Transfer] Class already exists: ${sourceClass.libelle}`);
                        continue;
                    }

                    await Class.create({
                        libelle: sourceClass.libelle,
                        niveau: sourceClass.niveau,
                        annee: destYear.name, // Use destination year name
                        pension: sourceClass.pension,
                        school_year_id: destYearId,
                        title: sourceClass.libelle // Try to satisfy hidden column
                    });
                    transferCount++;
                }
            } catch (err: any) {
                console.error(`❌ [Transfer] Error transferring class ${classId}:`, err);
                errors.push(err.message);
            }
        }

        console.log(`🎉 [Transfer] Completed. Count: ${transferCount}`);
        res.json({ message: 'Transfer successful', count: transferCount, errors });

    } catch (error: any) {
        console.error('❌ [Transfer] Server error during transfer:', error);
        res.status(500).json({ message: 'Server error during transfer', error: error.message });
    }
};
