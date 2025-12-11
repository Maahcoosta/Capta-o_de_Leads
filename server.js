const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// --- Configurações Iniciais ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos HTML, CSS, JS

// --- Conexão com o Banco de Dados (AJUSTE AQUI) ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',      // <-- Seu usuário do MySQL
    password: 'admin', // <-- Sua senha do MySQL
    database: 'crud_emprestimos'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('✅ Conectado ao MySQL.');
});

// --- ROTA PRINCIPAL: RECEBER E SALVAR A SOLICITAÇÃO (CREATE) ---
app.post('/solicitar', (req, res) => {
    const { nome, telefone, cpf, categoria, num_beneficio, valor_interesse, prazo, valor_parcela } = req.body;

    // 1. Inserção no Banco de Dados
    const sql = `INSERT INTO simulacoes (nome, telefone, cpf, categoria, num_beneficio, valor_interesse, prazo, valor_parcela) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [nome, telefone, cpf, categoria, num_beneficio || null, valor_interesse, prazo, valor_parcela];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao salvar no banco de dados:', err);
            return res.status(500).sendFile(path.join(__dirname, 'public', 'erro.html'));
        }
// ... (código de setup do express e conexão com o MySQL aqui) ...

// Rota para receber os dados do formulário (simulacao.html)
app.post('/solicitar', (req, res) => {
    // 1. Coleta de Dados do Formulário
    const { nome, telefone, cpf, categoria, num_beneficio, valor_interesse, prazo, valor_parcela } = req.body;

    // 2. Query SQL para Inserir (CREATE)
    const sql = `INSERT INTO simulacoes (nome, telefone, cpf, categoria, num_beneficio, valor_interesse, prazo, valor_parcela) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [nome, telefone, cpf, categoria, num_beneficio || null, valor_interesse, prazo, valor_parcela];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao salvar no banco de dados:', err);
            // Redireciona para uma página de erro (se existir)
            return res.status(500).send('Erro ao processar sua solicitação e salvar os dados.');
        }

        const id_solicitacao = result.insertId;
        console.log(`Nova simulação registrada com ID: ${id_solicitacao}`);

        // 3. Montagem da URL de Notificação para o WhatsApp
        
        // Número de destino (77) 988167901 no formato internacional (55 + DDD + Número)
        const numero_atendente = '5577988167901'; 
        
        const mensagem_raw = `🚨 NOVO PEDIDO DE SIMULAÇÃO (WEB) 🚨
ID: ${id_solicitacao}
Nome: ${nome}
Telefone: ${telefone}
CPF: ${cpf}

Categoria: ${categoria}
Nº Benefício: ${num_beneficio || 'N/A'}

SIMULAÇÃO:
Valor Interesse: R$ ${valor_interesse}
Prazo Desejado: ${prazo} meses
Parcela Sugerida: R$ ${valor_parcela}

Aguardando contato urgente.`;
        
        // Codifica a mensagem para quebrar linhas e caracteres especiais funcionem na URL
        const mensagem_encoded = encodeURIComponent(mensagem_raw);
        
        // Cria o link do WhatsApp
        const url_whatsapp = `https://api.whatsapp.com/send?phone=${numero_atendente}&text=${mensagem_encoded}`;
        
        // NOTIFICAÇÃO: Aqui, em um sistema real, você faria uma chamada a uma API de envio em background.
        // Para fins de teste/simulação, vamos apenas registrar no console para garantir que o link foi gerado.
        console.log(`✅ Link de Notificação para o Atendente Gerado: ${url_whatsapp}`);
        
        // 4. Redirecionamento para a página de Confirmação
        res.redirect(`/confirmacao.html?id=${id_solicitacao}`);
    });
});
        const id_solicitacao = result.insertId;
        const numero_atendente = '5577988167901'; // Número do WhatsApp (55 + DDD + Número)

        // 2. Montagem da Mensagem do WhatsApp
        const mensagem_raw = `🚨 NOVO PEDIDO DE SIMULAÇÃO 🚨\nID: ${id_solicitacao}\nNome: ${nome}\nTelefone: ${telefone}\nCPF: ${cpf}\nCategoria: ${categoria}\nNº Benefício: ${num_beneficio || 'N/A'}\n\nSIMULAÇÃO:\nValor Interesse: R$ ${valor_interesse}\nPrazo Desejado: ${prazo} meses\nParcela Sugerida: R$ ${valor_parcela}`;

        const mensagem_encoded = encodeURIComponent(mensagem_raw);
        const url_whatsapp = `https://api.whatsapp.com/send?phone=${numero_atendente}&text=${mensagem_encoded}`;

        // IMPORTANTE: Em sistemas reais, a chamada à API é feita aqui.
        // Aqui, apenas registramos no console para a simulação.
        console.log(`Link de Notificação Gerado: ${wa.me/77988167901}`);

        // 3. Redireciona o cliente para a página de sucesso
        res.redirect(`/confirmacao.html?id=${id_solicitacao}`);
    });
});

// --- Início do Servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});