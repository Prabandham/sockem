class ContactMailer < ApplicationMailer
  def new_contact_email
    mail(to: "krishcool688@gmail.com", subject: "Test mail from larks !")
  end
end
