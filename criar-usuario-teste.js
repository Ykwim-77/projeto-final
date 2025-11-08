// Script para criar um usuário temporário de teste
// Execute: node criar-usuario-teste.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Cria o Prisma Client apontando para o schema correto
const prisma = new PrismaClient();

async function criarUsuarioTeste() {
  try {
    // 1. Verificar se já existe tipo_usuario "admin" e "user"
    let tipoAdmin = await prisma.tipo_usuario.findFirst({
      where: { descricao: 'admin' }
    });

    let tipoUser = await prisma.tipo_usuario.findFirst({
      where: { descricao: 'user' }
    });

    // Criar tipos de usuário se não existirem
    if (!tipoAdmin) {
      tipoAdmin = await prisma.tipo_usuario.create({
        data: { descricao: 'admin' }
      });
      console.log('✅ Tipo de usuário "admin" criado (ID: ' + tipoAdmin.id_tipo_usuario + ')');
    }

    if (!tipoUser) {
      tipoUser = await prisma.tipo_usuario.create({
        data: { descricao: 'user' }
      });
      console.log('✅ Tipo de usuário "user" criado (ID: ' + tipoUser.id_tipo_usuario + ')');
    }

    // 2. Senha de teste
    const senha = '123456';

    // 3. Verificar se o email já existe
    const email = 'teste@progest.com';
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    // Gerar hash com bcrypt
    const hash = await bcrypt.hash(senha, 10);

    if (usuarioExistente) {
      // Atualiza a senha para o hash bcrypt para garantir compatibilidade
      await prisma.usuario.update({
        where: { email },
        data: { senha_hash: hash }
      });
      console.log('⚠️  Usuário existente atualizado com nova senha hash (bcrypt).');
      console.log('📝 Dados do usuário existente:');
      console.log('   Email: ' + email);
      console.log('   Senha: ' + senha);
      return;
    }

    // 4. Criar usuário de teste
    const usuario = await prisma.usuario.create({
      data: {
        nome: 'Usuário Teste',
        email: email,
        senha_hash: hash,
        id_tipo_usuario: tipoUser.id_tipo_usuario, // Tipo "user" (comum)
        ativo: true,
        cpf: null
      }
    });

    console.log('\n✅ Usuário de teste criado com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: ' + email);
    console.log('🔑 Senha: ' + senha);
    console.log('👤 Nome: Usuário Teste');
    console.log('🆔 ID: ' + usuario.id_usuario);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  LEMBRE-SE: Esta é uma senha em texto simples.');
    console.log('   Para produção, implemente autenticação adequada!\n');

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

criarUsuarioTeste();

