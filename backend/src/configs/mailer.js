import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarEmailRedefinicao = async (emailDestino, token) => {
  const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;
  await transporter.sendMail({
    from: `"Ilusões Industriais" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: "Redefinição de senha",
    html: `<p>Clique no link abaixo para redefinir sua senha. O link expira em 1 hora.</p>
              <a href="${link}">${link}</a>`,
  });
};
