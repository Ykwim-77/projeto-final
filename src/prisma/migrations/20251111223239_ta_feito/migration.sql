/*
  Warnings:

  - You are about to drop the `estoque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico_previsao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `previsao_demanda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipo_usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `id_tipo_usuario` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `tipo_usuario` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "estoque";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "historico_previsao";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "previsao_demanda";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tipo_usuario";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT
);
INSERT INTO "new_usuario" ("ativo", "cpf", "criado_em", "email", "id_usuario", "nome", "senha_hash") SELECT "ativo", "cpf", "criado_em", "email", "id_usuario", "nome", "senha_hash" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
