using MailKit.Net.Smtp;
using MimeKit;

namespace Backend.Services.Email
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            // Using SMTP Settings from appsettings.json
            var senderName = _configuration["SmtpSettings:SenderName"];
            var senderEmail = _configuration["SmtpSettings:SenderEmail"];
            var smtpServer = _configuration["SmtpSettings:Server"];
            var smtpPort = int.Parse(_configuration["SmtpSettings:Port"]);
            var smtpUsername = _configuration["SmtpSettings:Username"];
            var smtpPassword = _configuration["SmtpSettings:Password"];

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.Subject = subject;

            var bodyBuilder = new BodyBuilder { TextBody = body };
            email.Body = bodyBuilder.ToMessageBody();

            using (var smtpClient = new SmtpClient())
            {
                await smtpClient.ConnectAsync(smtpServer, smtpPort, false);
                await smtpClient.AuthenticateAsync(smtpUsername, smtpPassword);
                await smtpClient.SendAsync(email);
                await smtpClient.DisconnectAsync(true);
            };

        }
    }
}
