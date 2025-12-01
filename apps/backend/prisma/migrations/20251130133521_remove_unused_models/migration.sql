-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT IF EXISTS "Version_userId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT IF EXISTS "Version_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT IF EXISTS "Collaborator_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT IF EXISTS "Collaborator_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT IF EXISTS "Collaborator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_lastEditedBy_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_userId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Version_createdAt_idx";

-- DropIndex
DROP INDEX IF EXISTS "Version_userId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Version_documentId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Version_documentId_version_key";

-- DropIndex
DROP INDEX IF EXISTS "Comment_createdAt_idx";

-- DropIndex
DROP INDEX IF EXISTS "Comment_userId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Comment_documentId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Collaborator_projectId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Collaborator_documentId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Collaborator_userId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Collaborator_userId_projectId_key";

-- DropIndex
DROP INDEX IF EXISTS "Collaborator_userId_documentId_key";

-- DropIndex
DROP INDEX IF EXISTS "Document_projectId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Project_createdAt_idx";

-- DropIndex
DROP INDEX IF EXISTS "Project_userId_idx";

-- DropTable
DROP TABLE IF EXISTS "Version";

-- DropTable
DROP TABLE IF EXISTS "Comment";

-- DropTable
DROP TABLE IF EXISTS "Collaborator";

-- DropTable
DROP TABLE IF EXISTS "Project";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN IF EXISTS "projectId";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN IF EXISTS "lastEditedBy";

