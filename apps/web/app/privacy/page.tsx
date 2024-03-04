import { MDXRemote } from "next-mdx-remote/rsc";

const content = `
## Privacy Policy

### Introduction

- Welcome to Hartsy AI, where creativity meets cutting-edge AI art generation.
- This policy outlines how we handle your data with respect and care.

### Cookies and Tracking Technologies

- **Purpose and Use**: Cookies help us understand how users interact with our website, track user movements around the site, and gather demographic information about our user base. This enables us to tailor our services and enhance user experience.
- **Control and Opt-out**: Users can set their web browser to refuse cookies or to indicate when a cookie is being sent. However, some parts of our Service may not function properly without cookies.
- **Third-Party Cookies**: Third-party service providers, such as Google Analytics, may use cookies to collect information about your activities on our site and other websites to provide you with targeted advertising based on your interests.

### Detailed Cookie Policy

- **Types of Cookies Used**:

  - **Essential Cookies**: Necessary for website functionality.
  - **Performance Cookies**: Collect anonymous data for statistical purposes.
  - **Functional Cookies**: Enhance user experience (e.g., remember settings).
  - **Advertising Cookies**: Used for delivering targeted ads (if applicable).

- **Managing Cookies**:

  - You have control over your cookie preferences.
  - Instructions on managing cookies are typically found in browser settings.

- **Third-Party Cookies**:
  - We may use third-party service providers that set cookies to perform services on our behalf.
  - These cookies are governed by their respective privacy policies.

### Data Security

- **Secure Practices**: We implement a variety of security measures to maintain the safety of your personal information, including encryption, firewalls, and secure server hosting.
- **Data Breach Protocol**: In case of a data breach, we are prepared to take immediate steps to mitigate the breach's impact, and we will inform affected users in accordance with applicable laws.
- **Continuous Monitoring**: We continuously monitor our systems for potential vulnerabilities and attacks, and regularly update our security practices.

### Information Collection

- **Personal Identification Information**: We collect names, email addresses, and payment details for account creation, billing, and user support.
- **Non-Personal Information**: This includes browser type, device information, and general usage data to improve our service.
- **User-Generated Content**: Images, texts, or other inputs you provide for AI art generation are processed while respecting your privacy and intellectual property rights.

### Use of Information

- **Service Provision**: We use your personal information to operate, maintain, and provide the features of our AI art generation service, including the processing and completion of transactions.
- **Communication**: We utilize your contact information to communicate with you regarding your account, system updates, occasional newsletters, and promotional offers, if you've opted in.
- **Improvement**: Non-personal information helps us understand user patterns, identify areas of improvement, and optimize our website for a better user experience.
- **Customization**: We may use the information to personalize your experience on our platform, like suggesting relevant features or content.

### Data Sharing and Disclosure

- **Service Providers**: We engage third-party companies and individuals (like payment processors, cloud hosting services, and analytics providers) who assist us in operating our website and conducting our business, under confidentiality agreements.
- **Legal Compliance and Safety**: We may disclose your information if we believe it's necessary to comply with a legal obligation, protect and defend our rights or property, prevent fraud, or ensure the personal safety of users and the public.
- **Business Transfers**: In the event of a merger, acquisition, or asset sale, user information may be transferred as a business asset. In such cases, we will notify you before your personal information is transferred and becomes subject to a different privacy policy.

### User Rights

- **Access and Update**: You have the right to access and update your personal information at any time through your account settings.
- **Data Portability**: Upon request, we can provide you with a copy of your personal data in a machine-readable format.
- **Erasure**: You can request the deletion of your account and associated data, subject to certain conditions (like outstanding transactions or legal obligations).
- **Consent Withdrawal**: If we are processing your data based on consent, you have the right to withdraw consent at any time, without affecting the lawfulness of processing based on consent before its withdrawal.

### Policy for Children

- Our services are for individuals over the age of 13.
- We do not knowingly collect data from children under 13.

### Changes to This Privacy Policy

- We may update our policies periodically to reflect changes in our practices or legal requirements.
- Your continued use of our services after updates signifies your acceptance of the changes.

### Consent

- By using our website, you consent to our use of cookies in accordance with this policy.

### Contact Us

- Questions or feedback? Please don’t hesitate to reach out at hartsy.ai@gmail.com.
`;

export default async function PrivacyPage() {
  return (
    <div className="mt-20">
      <div className="prose-xl">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
