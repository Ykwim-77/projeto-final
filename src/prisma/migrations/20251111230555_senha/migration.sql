/*
  Warnings:

  - You are about to drop the column `senha_hash` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `senha` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT
);
INSERT INTO "new_usuario" ("ativo", "cpf", "criado_em", "email", "id_usuario", "nome", "tipo_usuario") SELECT "ativo", "cpf", "criado_em", "email", "id_usuario", "nome", "tipo_usuario" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
