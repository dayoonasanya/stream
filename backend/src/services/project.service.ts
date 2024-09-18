import prisma from '../config/database.config';
import { Project, ProjectImage } from '../interfaces';
import { AppError } from '../middlewares';
import { ProjectType } from '../enums';

// Helper function to map Prisma's Project to your custom Project interface
const mapPrismaProjectToCustomProject = (prismaProject: any): Project => {
  return {
    id: prismaProject.id,
    type: prismaProject.type,
    title: prismaProject.title,
    description: prismaProject.description,
    targetAmount: prismaProject.targetAmount,
    currentAmount: prismaProject.currentAmount,
    public: prismaProject.public,
    category: prismaProject.category,
    organizationId: prismaProject.organizationId,
    startupId: prismaProject.startupId,
    images: prismaProject.images || [],
    githubLink: prismaProject.githubLink,
    landingPageLink: prismaProject.landingPageLink,
    transactions: prismaProject.transactions || [],
    createdAt: prismaProject.createdAt,
    updatedAt: prismaProject.updatedAt,
  };
};

// Create Project
export const createProject = async (
  projectData: Partial<Project>
): Promise<Project | null> => {
  try {
    const project = await prisma.project.create({
      data: {
        type: projectData.type!,
        title: projectData.title!,
        description: projectData.description!,
        targetAmount: projectData.targetAmount!,
        currentAmount: projectData.currentAmount || 0,
        public: projectData.public || true,
        category: projectData.category,
        organizationId: projectData.organizationId,
        startupId: projectData.startupId,
        githubLink: projectData.githubLink,
        landingPageLink: projectData.landingPageLink,
        images: {
          create: projectData.images?.map((image) => ({
            url: image.url,
          })),
        },
      },
      include: {
        images: true,
        transactions: true,
      },
    });

    return project ? mapPrismaProjectToCustomProject(project) : null;
    
  } catch (error) {
    console.error('Error creating project:', error);
    throw new AppError('Error creating project', 500);
  }
};

// Update Project
export const updateProject = async (
  projectId: string,
  projectData: Partial<Project>
): Promise<Project | null> => {
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      throw new AppError('Project not found', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: projectData.title,
        description: projectData.description,
        targetAmount: projectData.targetAmount,
        public: projectData.public,
        category: projectData.category,
        githubLink: projectData.githubLink,
        landingPageLink: projectData.landingPageLink,
        images: {
          deleteMany: { projectId },
          create: projectData.images?.map((image) => ({
            url: image.url,
          })),
        },
      },
      include: {
        images: true,
        transactions: true,
      },
    });

    return updatedProject ? mapPrismaProjectToCustomProject(updatedProject) : null;
  } catch (error) {
    throw new AppError('Error updating project', 500);
  }
};

// Delete Project
export const deleteProject = async (projectId: string): Promise<Project | null> => {
  try {
    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
      include: {
        images: true,
        transactions: true,
      },
    });

    return deletedProject ? mapPrismaProjectToCustomProject(deletedProject) : null;
  } catch (error) {
    throw new AppError('Error deleting project', 500);
  }
};

// Retrieve Projects by Type
export const getProjectsByType = async (type: ProjectType): Promise<Project[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: { type },
      include: {
        images: true,
        transactions: true,
      },
    });

    return projects.map(mapPrismaProjectToCustomProject);
  } catch (error) {
    throw new AppError('Error retrieving projects by type', 500);
  }
};

// Set Project Visibility
export const setProjectVisibility = async (
  projectId: string,
  isPublic: boolean
): Promise<Project | null> => {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { public: isPublic },
    });

    return updatedProject ? mapPrismaProjectToCustomProject(updatedProject) : null;
  } catch (error) {
    throw new AppError('Error setting project visibility', 500);
  }
};

// Categorize Project
export const categorizeProject = async (
  projectId: string,
  category: string
): Promise<Project | null> => {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { category },
    });

    return updatedProject ? mapPrismaProjectToCustomProject(updatedProject) : null;
  } catch (error) {
    throw new AppError('Error categorizing project', 500);
  }
};

// Adjust Target Amount based on Donations or Investments
export const adjustTargetAmount = async (
  projectId: string,
  newAmount: number
): Promise<Project | null> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { currentAmount: project.currentAmount + newAmount },
      include: {
        transactions: true,
        images: true,
      },
    });

    return updatedProject ? mapPrismaProjectToCustomProject(updatedProject) : null;
  } catch (error) {
    throw new AppError('Error adjusting target amount', 500);
  }
};


// Get a single project by ID
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        images: true,
        transactions: true,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return mapPrismaProjectToCustomProject(project);
  } catch (error) {
    throw new AppError('Error retrieving project', 500);
  }
};

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true,
        transactions: true,
      },
    });

    return projects.map(mapPrismaProjectToCustomProject);
  } catch (error) {
    throw new AppError('Error retrieving projects', 500);
  }
};