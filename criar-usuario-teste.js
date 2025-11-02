// Script para criar um usuário temporário de teste
// Execute: node criar-usuario-teste.js

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

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

    // 2. Criar hash simples da senha (para testes, senha: "123456")
    // Em produção, use bcrypt ou similar
    const senha = '123456';
    const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

    // 3. Verificar se o email já existe
    const emailExistente = await prisma.usuario.findUnique({
      where: { email: 'teste@progest.com' }
    });

    if (emailExistente) {
      console.log('⚠️  Usuário com email teste@progest.com já existe!');
      console.log('📝 Dados do usuário existente:');
      console.log('   Email: teste@progest.com');
      console.log('   Senha: 123456');
      return;
    }

    // 4. Criar usuário de teste
    const usuario = await prisma.usuario.create({
      data: {
        nome: 'Usuário Teste',
        email: 'teste@progest.com',
        senha_hash: senhaHash,
        id_tipo_usuario: tipoUser.id_tipo_usuario, // Tipo "user" (comum)
        ativo: true,
        CPF: null
      }
    });

    console.log('\n✅ Usuário de teste criado com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: teste@progest.com');
    console.log('🔑 Senha: 123456');
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

