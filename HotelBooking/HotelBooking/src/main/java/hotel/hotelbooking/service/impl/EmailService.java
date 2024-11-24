package hotel.hotelbooking.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendResetCode(String to, String resetCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        log.info("{}",resetCode);
        message.setFrom(fromEmail);
        log.info("{}",fromEmail);
        log.info("{}",to);

        message.setTo(to);
        message.setSubject("Mã xác thực đặt lại mật khẩu");
        message.setText("Mã xác thực của bạn là: " + resetCode +
                "\nMã này sẽ hết hạn sau 15 phút.");

        javaMailSender.send(message);
    }
}
