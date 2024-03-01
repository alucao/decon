import "./faq-modal.css";

function FaqModal() {
  return (
    <div
      className="modal fade"
      id="faqModal"
      data-bs-backdrop="static"
      tabIndex={-1}
      aria-labelledby="faqModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="faqModalLabel">
              FAQ
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body d-block">
            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-01"
              role="button"
              aria-expanded="false"
              aria-controls="question-01"
            >
              What is decon?
            </a>
            <div id="question-01" className="collapse">
              <span className="faq-response">
                decon is a decentralized and open-source social platform and
                marketplace running on top of the Cardano blockchain.
                <br />
                It allows users to advertise their goods/services and exchange
                messages. <br />
                All data is stored on the blockchain. Nobody owns or controls
                the data submitted by users. <br />
                Users posts and messages cannot be censured and the service
                cannot be taken down or attacked with DoS (Denial of Service).{" "}
                <br />
                Even the category menu is populated dynamically with the data
                provided by the users. <br />
                Private messages between users are encrypted.
              </span>
            </div>

            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-02"
              role="button"
              aria-expanded="false"
              aria-controls="question-02"
            >
              How can I use decon?
            </a>
            <div id="question-02" className="collapse">
              <span className="faq-response">
                To use decon you just need a Cardano wallet with some ADA
                (cryptocurrency) in it.
                <br />
                One example of a Cardano wallet is{" "}
                <a href="https://yoroi-wallet.com/" target="_blank">
                  Yoroi
                </a>
                . It is an extension that is installed in the web browser.
                <br />
                In android/iphone the VESPR wallet is needed. The user navigates
                to decon.app from the VESPR wallet browser.
              </span>
            </div>

            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-sign-up"
              role="button"
              aria-expanded="false"
              aria-controls="question-sign-up"
            >
              How can I sign up?
            </a>
            <div id="question-sign-up" className="collapse">
              <span className="faq-response">
                There is no need to sign up. New users just need to select their
                username the first time they create a post or send a message.
                <br />
                The username is then associated with the wallet. No passwords
                are needed to login.
              </span>
            </div>

            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-password"
              role="button"
              aria-expanded="false"
              aria-controls="question-password"
            >
              Why do I need to put my password twice?
            </a>
            <div id="question-password" className="collapse">
              <span className="faq-response">
                The first time a password is required is to sign the data to
                prove that it was you and only you who created the post/message.
                The second time is to actually send the data to the blockchain.
              </span>
            </div>

            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-ada-transfer"
              role="button"
              aria-expanded="false"
              aria-controls="question-ada-transfer"
            >
              Why do I need to transfer 1 ADA to create a post or message?
            </a>
            <div id="question-ada-transfer" className="collapse">
              <span className="faq-response">
                For a couple of reasons. First because to store data in the
                blockchain a transaction has to be made and the minimum amount
                for a transaction required by Cardano is 1 ADA. Second reason is
                to attempt to minimize spam by creating a financial cost for it.
              </span>
            </div>

            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-roadmap"
              role="button"
              aria-expanded="false"
              aria-controls="question-roadmap"
            >
              Any roadmap plans?
            </a>
            <div id="question-roadmap" className="collapse">
              <span className="faq-response">
                Yes, such as: User feedback, decentralized payment
                escrow/disputes, third party services, improved UI.
              </span>
            </div>

            <a
              className="faq-question d-block"
              data-bs-toggle="collapse"
              href="#question-download"
              role="button"
              aria-expanded="false"
              aria-controls="question-download"
            >
              How can I run my own decon website?
            </a>
            <div id="question-download" className="collapse">
              <span className="faq-response">
                It is as simple as installing it from the browser as a
                Progressive Web App (PWA).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqModal;
