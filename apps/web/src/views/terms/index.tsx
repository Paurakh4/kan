import Link from "next/link";

import { PageHead } from "~/components/PageHead";
import Layout from "../home/components/Layout";

export default function TermsView() {
  const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-4 text-2xl font-bold text-light-1000 dark:text-dark-950">
      {children}
    </h3>
  );

  const Text = ({ children }: { children: React.ReactNode }) => (
    <p className="line-height text-md mb-4 text-light-1000 dark:text-dark-900">
      {children}
    </p>
  );

  const UnorderedList = ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-6">{children}</ul>
  );

  const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="line-height text-md mb-4 text-light-1000 dark:text-dark-900">
      {children}
    </li>
  );

  const NAME = "Open Engineering";
  const DOMAIN = "https://kan.bn";
  const PRIVACY_URL = `${DOMAIN}/privacy`;
  const CONTACT_EMAIL = "support@kan.bn";

  return (
    <Layout>
      <PageHead title="Terms of Service | kan.bn" />
      <div className="flex flex-col items-center">
        <div className="mb-20 flex h-full w-full max-w-[800px] flex-col lg:pt-[5rem]">
          <div className="flex items-center justify-center py-36 text-4xl font-bold tracking-tight text-light-1000 dark:text-dark-1000">
            <h2>Terms of Service</h2>
          </div>
          <p className="mb-6 text-sm text-light-1000 dark:text-dark-900">
            Last updated: 26rd Feb 2025
          </p>
          <div className="mb-6">
            <SubHeading>Introduction</SubHeading>
            <Text>
              These Terms of Service (“Terms”, “Terms of Service”) govern your
              use of our web pages located at {DOMAIN} operated by {NAME}.
            </Text>
            <Text>
              Our Privacy Policy also governs your use of our Service and
              explains how we collect, safeguard and disclose information that
              results from your use of our web pages. Please read it here{" "}
              <Link href={PRIVACY_URL}>{PRIVACY_URL}</Link>.
            </Text>
            <Text>
              Your agreement with us includes these Terms and our Privacy Policy
              (“Agreements”). You acknowledge that you have read and understood
              Agreements, and agree to be bound of them.
            </Text>
            <Text>
              If you do not agree with (or cannot comply with) Agreements, then
              you may not use the Service, but please let us know by emailing at{" "}
              {CONTACT_EMAIL} so we can try to find a solution. These Terms
              apply to all visitors, users and others who wish to access or use
              Service. Thank you for being responsible.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Communications</SubHeading>
            <Text>
              By creating an Account on our Service, you agree to subscribe to
              newsletters, marketing or promotional materials and other
              information we may send. However, you may opt out of receiving
              any, or all, of these communications from us by following the
              unsubscribe link or by emailing at {CONTACT_EMAIL}.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Purchases</SubHeading>
            <Text>
              If you wish to purchase any product or service made available
              through Service (“Purchase”), you may be asked to supply certain
              information relevant to your Purchase including, without
              limitation, your credit card number, the expiration date of your
              credit card, your billing address, and your shipping information.
            </Text>
            <Text>
              You represent and warrant that: (i) you have the legal right to
              use any credit card(s) or other payment method(s) in connection
              with any Purchase; and that (ii) the information you supply to us
              is true, correct and complete.
            </Text>
            <Text>
              You represent and warrant that: (i) you have the legal right to
              use any credit card(s) or other payment method(s) in connection
              with any Purchase; and that (ii) the information you supply to us
              is true, correct and complete.
            </Text>
            <Text>
              We may employ the use of third party services for the purpose of
              facilitating payment and the completion of Purchases. By
              submitting your information, you grant us the right to provide the
              information to these third parties subject to our Privacy Policy.
            </Text>
            <Text>
              We reserve the right to refuse or cancel your order at any time
              for reasons including but not limited to: product or service
              availability, errors in the description or price of the product or
              service, error in your order or other reasons.
            </Text>
            <Text>
              We reserve the right to refuse or cancel your order if fraud or an
              unauthorized or illegal transaction is suspected.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Contests, Sweepstakes and Promotions</SubHeading>
            <Text>
              Any contests, sweepstakes or other promotions (collectively,
              “Promotions”) made available through Service may be governed by
              rules that are separate from these Terms of Service. If you
              participate in any Promotions, please review the applicable rules
              as well as our Privacy Policy. If the rules for a Promotion
              conflict with these Terms of Service, Promotion rules will apply.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Subscriptions</SubHeading>
            <Text>
              Some parts of Service are billed on a subscription basis
              (“Subscription(s)”). You will be billed in advance on a recurring
              and periodic basis (“Billing Cycle”). Billing cycles are set
              either on a monthly or annual basis, depending on the type of
              subscription plan you select when purchasing a Subscription.
            </Text>
            <Text>
              At the end of each Billing Cycle, your Subscription will
              automatically renew under the exact same conditions unless you
              cancel it or {NAME} cancels it. You may cancel your Subscription
              renewal either through your online account management page or by
              contacting {NAME} customer support team.
            </Text>
            <Text>
              A valid payment method, including credit card or PayPal, is
              required to process the payment for your subscription. You shall
              provide {NAME} with accurate and complete billing information
              including full name, address, state, zip code, telephone number,
              and a valid payment method information. By submitting such payment
              information, you automatically authorize {NAME} to charge all
              Subscription fees incurred through your account to any such
              payment instruments.
            </Text>
            <Text>
              Should automatic billing fail to occur for any reason, {NAME} will
              issue an electronic invoice indicating that you must proceed
              manually, within a certain deadline date, with the full payment
              corresponding to the billing period as indicated on the invoice.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Fee Changes</SubHeading>
            <Text>
              {NAME}, in its sole discretion and at any time, may modify
              Subscription fees for the Subscriptions. Any Subscription fee
              change will become effective at the end of the then-current
              Billing Cycle.
            </Text>
            <Text>
              {NAME}, will provide you with a reasonable prior notice of any
              change in Subscription fees to give you an opportunity to
              terminate your Subscription before such change becomes effective.
            </Text>
            <Text>
              Your continued use of Service after Subscription fee change comes
              into effect constitutes your agreement to pay the modified
              Subscription fee amount.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Refunds</SubHeading>
            <Text>
              Except when required by law, paid Subscription fees are
              non-refundable.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Content</SubHeading>
            <Text>
              Our Service allows you to post, link, store, share and otherwise
              make available certain information, text, graphics, videos, or
              other material (“Content”). You are responsible for Content that
              you post on or through Service, including its legality,
              reliability, and appropriateness.
            </Text>
            <Text>
              By posting Content on or through Service, You represent and
              warrant that: (i) Content is yours (you own it) and/or you have
              the right to use it and the right to grant us the rights and
              license as provided in these Terms, and (ii) that the posting of
              your Content on or through Service does not violate the privacy
              rights, publicity rights, copyrights, contract rights or any other
              rights of any person or entity. We reserve the right to terminate
              the account of anyone found to be infringing on a copyright.
            </Text>
            <Text>
              You retain any and all of your rights to any Content you submit,
              post or display on or through Service and you are responsible for
              protecting those rights. We take no responsibility and assume no
              liability for Content you or any third party posts on or through
              Service. However, by posting Content using Service you grant us
              the right and license to use, modify, publicly perform, publicly
              display, reproduce, and distribute such Content on and through
              Service. You agree that this license includes the right for us to
              make your Content available to other users of Service, who may
              also use your Content subject to these Terms.
            </Text>
            <Text>
              {NAME} has the right but not the obligation to monitor and edit
              all Content provided by users. In addition, Content found on or
              through this Service are the property of {NAME} or used with
              permission. You may not distribute, modify, transmit, reuse,
              download, repost, copy, or use said Content, whether in whole or
              in part, for commercial purposes or for personal gain, without
              express advance written permission from us.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Prohibited Uses</SubHeading>
            <Text>
              You may use Service only for lawful purposes and in accordance
              with Terms. You agree not to use Service:
            </Text>
            <UnorderedList>
              <ListItem>
                In any way that violates any applicable national or
                international law or regulation.
              </ListItem>
              <ListItem>
                For the purpose of exploiting, harming, or attempting to exploit
                or harm minors in any way by exposing them to inappropriate
                content or otherwise.
              </ListItem>
              <ListItem>
                To transmit, or procure the sending of, any advertising or
                promotional material, including any “junk mail”, “chain letter,”
                “spam,” or any other similar solicitation.
              </ListItem>
              <ListItem>
                To impersonate or attempt to impersonate Company, a Company
                employee, another user, or any other person or entity.
              </ListItem>
              <ListItem>
                In any way that infringes upon the rights of others, or in any
                way is illegal, threatening, fraudulent, or harmful, or in
                connection with any unlawful, illegal, fraudulent, or harmful
                purpose or activity.
              </ListItem>
              <ListItem>
                To engage in any other conduct that restricts or inhibits
                anyone’s use or enjoyment of Service, or which, as determined by
                us, may harm or offend Company or users of Service or expose
                them to liability.
              </ListItem>
            </UnorderedList>
            <Text>Additionally, you agree not to:</Text>
            <UnorderedList>
              <ListItem>
                Use Service in any manner that could disable, overburden,
                damage, or impair Service or interfere with any other party’s
                use of Service, including their ability to engage in real time
                activities through Service.
              </ListItem>
              <ListItem>
                Use any robot, spider, or other automatic device, process, or
                means to access Service for any purpose, including monitoring or
                copying any of the material on Service.
              </ListItem>
              <ListItem>
                Use any manual process to monitor or copy any of the material on
                Service or for any other unauthorized purpose without our prior
                written consent.
              </ListItem>
              <ListItem>
                Use any device, software, or routine that interferes with the
                proper working of Service.
              </ListItem>
              <ListItem>
                Introduce any viruses, trojan horses, worms, logic bombs, or
                other material which is malicious or technologically harmful.
              </ListItem>
              <ListItem>
                Attempt to gain unauthorized access to, interfere with, damage,
                or disrupt any parts of Service, the server on which Service is
                stored, or any server, computer, or database connected to
                Service.
              </ListItem>
              <ListItem>
                Attack Service via a denial-of-service attack or a distributed
                denial-of-service attack.
              </ListItem>
              <ListItem>
                Take any action that may damage or falsify Company rating.
              </ListItem>
              <ListItem>
                Otherwise attempt to interfere with the proper working of
                Service.
              </ListItem>
            </UnorderedList>
          </div>

          <div className="mb-6">
            <SubHeading>Analytics</SubHeading>
            <Text>
              We may use third-party Service Providers to monitor and analyze
              the use of our Service.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Age Restrictions</SubHeading>
            <Text>
              Service is intended only for access and use by individuals at
              least thirteen (13) years old. By accessing or using any of
              Company, you warrant and represent that you are at least thirteen
              (13) years of age and with the full authority, right, and capacity
              to enter into this agreement and abide by all of the terms and
              conditions of Terms. If you are not at least thirteen (13) years
              old, you are prohibited from both the access and usage of Service.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Accounts</SubHeading>
            <Text>
              When you create an account with us, you guarantee that you are
              above the age of 13, and that the information you provide us is
              accurate, complete, and current at all times. Inaccurate,
              incomplete, or obsolete information may result in the immediate
              termination of your account on Service.
            </Text>
            <Text>
              You are responsible for maintaining the confidentiality of your
              account and password, including but not limited to the restriction
              of access to your computer and/or account. You agree to accept
              responsibility for any and all activities or actions that occur
              under your account and/or password, whether your password is with
              our Service or a third-party service. You must notify us
              immediately upon becoming aware of any breach of security or
              unauthorized use of your account.
            </Text>
            <Text>
              In certain circumstances, you have the following data protection
              rights:
            </Text>
            <UnorderedList>
              <ListItem>
                You may not use as a username the name of another person or
                entity or that is not lawfully available for use, a name or
                trademark that is subject to any rights of another person or
                entity other than you, without appropriate authorization. You
                may not use as a username any name that is offensive, vulgar or
                obscene.
              </ListItem>
              <ListItem>
                We reserve the right to refuse service, terminate accounts,
                remove or edit content, or cancel orders in our sole discretion.
              </ListItem>
            </UnorderedList>
          </div>

          <div className="mb-6">
            <SubHeading>Intellectual Property</SubHeading>
            <Text>
              Service and its original content (excluding Content provided by
              users), features and functionality are and will remain the
              exclusive property of {NAME}. and its licensors. Service is
              protected by copyright, trademark, and other laws of foreign
              countries. Our trademarks and trade dress may not be used in
              connection with any product or service without the prior written
              consent of {NAME}.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Error Reporting & Feedback</SubHeading>
            <Text>
              You may provide us either directly at {CONTACT_EMAIL} or via third
              party sites and tools with information and feedback concerning
              errors, suggestions for improvements, ideas, problems, complaints,
              and other matters related to our Service (“Feedback”). You
              acknowledge and agree that: (i) you shall not retain, acquire or
              assert any intellectual property right or other right, title or
              interest in or to the Feedback; (ii) Company may have development
              ideas similar to the Feedback; (iii) Feedback does not contain
              confidential information or proprietary information from you or
              any third party; and (iv) Company is not under any obligation of
              confidentiality with respect to the Feedback. In the event the
              transfer of the ownership to the Feedback is not possible due to
              applicable mandatory laws, you grant Company and its affiliates an
              exclusive, transferable, irrevocable, free-of-charge,
              sub-licensable, unlimited and perpetual right to use (including
              copy, modify, create derivative works, publish, distribute and
              commercialize) Feedback in any manner and for any purpose.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Links To Other Web Sites</SubHeading>
            <Text>
              Our Service may contain links to third party web sites or services
              that are not owned or controlled by {NAME}.
            </Text>
            <Text>
              {NAME} has no control over, and assumes no responsibility for the
              content, privacy policies, or practices of any third party web
              sites or services. We do not warrant the offerings of any of these
              entities/individuals or their websites.
            </Text>
            <Text>
              YOU ACKNOWLEDGE AND AGREE THAT {NAME.toUpperCase()} SHALL NOT BE
              RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR
              LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE
              OF OR RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON
              OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES.
            </Text>
            <Text>
              WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY
              POLICIES OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Disclaimer of Warranty</SubHeading>
            <Text>
              THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS
              AVAILABLE” BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES
              OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR
              SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED
              THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES,
              THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT
              YOUR SOLE RISK.
            </Text>
            <Text>
              NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY
              WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS,
              SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE
              SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR
              ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE
              SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH
              THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR
              UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES
              OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER
              HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS
              OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR
              EXPECTATIONS.
            </Text>
            <Text>
              COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER
              EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT
              LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT,
              AND FITNESS FOR PARTICULAR PURPOSE.
            </Text>
            <Text>
              THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE
              EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Limitation of Liability</SubHeading>
            <Text>
              EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT,
              PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT
              ARISES (INCLUDING ATTORNEYS' FEES AND ALL RELATED COSTS AND
              EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL,
              IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED),
              WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS
              ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
              INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR
              PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY
              YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR
              REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE
              IS LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO
              THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO
              CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES.
              SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE,
              INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR
              EXCLUSION MAY NOT APPLY TO YOU.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Termination</SubHeading>
            <Text>
              We may terminate or suspend your account and bar access to Service
              immediately, without prior notice or liability, under our sole
              discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of Terms.
            </Text>
            <Text>
              If you wish to terminate your account, you may simply discontinue
              using Service.
            </Text>
            <Text>
              All provisions of Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Governing Law</SubHeading>
            <Text>
              These Terms shall be governed and construed in accordance with the
              laws of the United Kingdom without regard to its conflict of law
              provisions.
            </Text>
            <Text>
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service and supersede and replace any prior agreements we might
              have had between us regarding Service.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Changes To Service</SubHeading>
            <Text>
              We reserve the right to withdraw or amend our Service, and any
              service or material we provide via Service, in our sole discretion
              without notice. We will not be liable if for any reason all or any
              part of Service is unavailable at any time or for any period. From
              time to time, we may restrict access to some parts of Service, or
              the entire Service, to users, including registered users.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Amendments To Terms</SubHeading>
            <Text>
              We may amend Terms at any time by posting the amended terms on
              this site. It is your responsibility to review these Terms
              periodically.
            </Text>
            <Text>
              Your continued use of the Platform following the posting of
              revised Terms means that you accept and agree to the changes. You
              are expected to check this page frequently so you are aware of any
              changes, as they are binding on you.
            </Text>
            <Text>
              By continuing to access or use our Service after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use Service.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Waiver And Severability</SubHeading>
            <Text>
              No waiver by Company of any term or condition set forth in Terms
              shall be deemed a further or continuing waiver of such term or
              condition or a waiver of any other term or condition, and any
              failure of Company to assert a right or provision under Terms
              shall not constitute a waiver of such right or provision.
            </Text>
            <Text>
              If any provision of Terms is held by a court or other tribunal of
              competent jurisdiction to be invalid, illegal or unenforceable for
              any reason, such provision shall be eliminated or limited to the
              minimum extent such that the remaining provisions of Terms will
              continue in full force and effect.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Acknowledgement</SubHeading>
            <Text>
              BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE
              THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY
              THEM.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Contact Us</SubHeading>
            <Text>
              If you have any questions about these terms of service, please
              contact us at{" "}
              <Link
                className="line-height text-md mb-4 text-light-1000 dark:text-dark-900"
                href="mailto:support@vibeplanify.com"
              >
                support@vibeplanify.com
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </Layout>
  );
}
