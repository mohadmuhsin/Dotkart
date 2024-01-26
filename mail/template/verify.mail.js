function verifyEmail(otp) {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Outfit:wght@200;400;600&display=swap"
          rel="stylesheet"
        />
        <style>
          :root {
            --mw-1: 60%;
            --fs-1: 15px;
            --fs-h: 20px;
          }
          * {
            font-family: "Outfit", sans-serif;
            font-weight: 300;
            font-size: var(--fs-1);
          }
          body {
            margin: 0;
            padding: 0;
          }
          a {
            text-decoration: none;
            color: #1b85e7;
            cursor: pointer;
          }
          h1 {
            text-align: center;
            font-size: var(--fs-h);
          }
          .head-text {
            color: #1b85e7;
            font-weight: 700;
            font-size: var(--fs-h);
          }
          .center {
            display: block;
            margin: 0 auto;
          }
    
          .mt-20 {
            margin-top: 20px;
          }
    
          .mt-40 {
            margin-top: 40px;
          }
    
          .mt-80 {
            margin-top: 80px;
          }
    
          .letter {
            max-width: var(--mw-1);
          }
          .blue-btn {
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            background-color: #1b85e7;
            color: white;
            font-weight: 700;
            cursor: pointer;
            transition: all;
            transition-duration: 700ms;
          }
          .blue-btn:active {
            background-color: #3873ab;
          }
          .letter-note {
            max-width: var(--mw-1);
            font-size: 15px;
            font-weight: 900;
          }
          .otp{
            font-weight: 900;
            cursor: pointer;
          }
          .why-verify {
            background-color: #1b85e7;
            padding: 30px;
          }
          .why-verify p {
            color: white;
            max-width: var(--mw-1);
          }
          .how-verify {
            padding: 30px;
          }
          .how-verify p {
            max-width: var(--mw-1);
          }
          ol li {
            margin: 20px 0;
          }
          .need-and-importand {
            padding: 30px;
            background-color: #f3f3f3;
          }
          .need-and-importand p {
            max-width: var(--mw-1);
          }
          .end-note {
            padding: 40px;
            max-width: var(--mw-1);
          }
        </style>
      </head>
      <body>
        <div class="main-logo mt-20">
          <div>
            <h1 class="center" style="color: #1b85e7; font-weight: 900">Dotkart</h1>
          </div>
        </div>
    
        <div class="letter center mt-40">
                <p>
            Thank you for registering with Dotkart! We're excited to have you
            on board.
          </p>
          <p>
            To ensure the security of your account and provide you with the best
            experience, we need to verify your email address. 
          </p>
        </div>
        <div class="letter-note center mt-40">
           
          Your OTP:
          <h1 class="otp" onclick="copyText()">${otp}</h1>
        </div>
        <div class="why-verify mt-80">
          <h1 style="color: white" class="head-text center">Why Verify Account</h1>
          <p style="margin: 40px auto" class="center">
            Verifying your account helps us protect your information and ensures
            that you have control over your account. It also allows us to keep you
            updated with important notifications about your account and the latest
            features on Dotkart.
          </p>
        </div>
        <div class="need-and-importand ">
          <h1 class="head-text center">Need Help?</h1>
          <p style="margin: 40px auto" class="center">
            If you encounter any issues or have questions, please don't hesitate to
            contact our support team at [support@websitename.com]. We're here to
            help!
          </p>
          <h1 class="head-text center mt-40">Importand Note</h1>
          <p style="margin: 30px auto" class="center">
            This email was sent from an automated system, and replies to this email
            address are not monitored. If you have any questions, please contact our
            support team.
          </p>
          <p class="center">
            If you did not create an account on Dotkart, pleaseignore this
            email.
          </p>
        </div>
        <div class="end-note mt-20 center">
          <p style="margin: 20px auto" class="center">
            Thank you for choosing Dotkart! We look forward to serving you.
          </p>
          <p style="margin: 20px auto" class="center">Best regards,</p>
          <p style="margin: 20px auto" class="center">The Dotkart Team</p>
        </div>
        <div style="max-width: var(--mw-1); margin: 0 auto">
          <h1 style="text-align: left; color: #1b85e7; font-weight: 900">Dotkart</h1>
        </div>
        <script>
            function copyText() {
              // Select the text to copy
              var textToCopy = document.querySelector('.otp').innerText;
            
              // Create a textarea element to hold the text temporarily
              var textarea = document.createElement('textarea');
              textarea.value = textToCopy;
              document.body.appendChild(textarea);
            
              // Select the text within the textarea
              textarea.select();
              textarea.setSelectionRange(0, 99999); // For mobile devices
            
              // Copy the text to the clipboard
              document.execCommand('copy');
            
              // Remove the textarea
              document.body.removeChild(textarea);
            
              // Optionally, provide some visual feedback
              alert('Text copied to clipboard: ' + textToCopy);
            }
            </script>
      </body>
    </html>`;
  }
  
  
  module.exports = {
    verifyEmail
  }