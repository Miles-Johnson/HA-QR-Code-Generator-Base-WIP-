import { MDXRemote } from "next-mdx-remote/rsc";

const content = `
# **Terms of Use**

### **IMPORTANT NOTICE: PLEASE REVIEW THESE TERMS OF USE CAREFULLY. BY ACCESSING OR ENGAGING WITH HARTSY.AI (THE “WEBSITE”) OR BY USING ANY IMAGES, VIDEOS, OR OTHER MATERIALS GENERATED THROUGH HARTSY.AI (HEREAFTER COLLECTIVELY REFERRED TO AS THE “SERVICES”), YOU ARE AGREEING TO THESE TERMS AND CONDITIONS, INCLUDING ANY DOCUMENTS INCORPORATED BY REFERENCE HEREIN. IT IS YOUR, THE USER’S, RESPONSIBILITY TO UNDERSTAND AND COMPLY WITH THESE TERMS AND CONDITIONS PRIOR TO USING THE WEBSITE. IF YOU ARE NOT IN FULL AGREEMENT WITH THESE TERMS, YOU ARE ADVISED NOT TO ACCESS OR UTILIZE OUR WEBSITE OR SERVICES.**

### These terms and conditions (the “Agreement” or “Terms”) are a binding legal agreement between you, the user, and Hartsy AI LLC (referred to as “Hartsy AI”, “we”, “us”, or “our”), a legally established entity under the laws of the United States, governing your use of the Website and Services.

## **1. Acceptance of Terms**
- This Agreement sets forth legally binding terms for your use of Hartsy AI. By using Hartsy AI, you agree to be bound by this Agreement, whether you are a visitor browsing the Site or you are a registered user. If you do not accept the terms of this Agreement, you should leave the Hartsy AI website immediately. We may modify this Agreement from time to time, and such modification shall be effective upon its posting on Hartsy AI. You agree to be bound by any changes to this Agreement when you use Hartsy AI after any such modification is posted.

## **2. Service Description**
- Hartsy AI offers a digital platform that uses artificial intelligence to create and manipulate images and videos (the “Generated Content”). The service interprets user inputs, including text and image prompts, to produce unique artistic creations. The nature of AI-generated content is inherently experimental and creative, and as such, the outcomes are subject to variability and artistic interpretation.

## **3. User Conduct and Responsibilities**
- Users are required to conduct themselves in a manner that is lawful, respectful, and considerate of others. The use of Hartsy AI to generate content that is illegal, infringing, threatening, harmful, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable is strictly prohibited.
- You acknowledge that you are responsible for any material that you submit for art generation on Hartsy AI, and you, not Hartsy AI, have full responsibility for the message, including its legality, reliability, appropriateness, originality, and copyright.

## **4. Intellectual Property Rights and Usage**
- The Generated Content produced by Hartsy AI, including all images, videos, designs, text, graphics, and other files, and their selection and arrangement, are proprietary to Hartsy AI, protected by copyright, and are the intellectual property of Hartsy AI and/or its licensors.
- Users are granted a limited, revocable, nonexclusive license to use the Generated Content produced on Hartsy AI solely for their personal or commercial use, subject to the terms of this Agreement. This license does not include any resale or commercial use of the Generated Content or its derivatives.

## **5. User-Generated Content and Licensing**
- By submitting any material to Hartsy AI, you grant Hartsy AI a perpetual, irrevocable, non-exclusive, royalty-free, worldwide license to use, copy, modify, adapt, distribute, translate, create derivative works from, perform, display, and otherwise exploit such content in any form, media, or technology now known or hereafter developed.
- You represent and warrant that you own or otherwise control all of the rights to the content that you submit; that the content is accurate; that use of the content you supply does not violate this Agreement and will not cause injury to any person or entity; and that you will indemnify Hartsy AI for all claims resulting from content you supply.

## **6. Limitation of Liability and Disclaimer of Warranties**
- Hartsy AI, its directors, employees, agents, suppliers, or affiliates, will not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, arising out of or in connection with this Agreement, the Site, the Service, the inability to use the Service, or those resulting from any goods or services purchased or
 obtained or messages received or transactions entered into through the Service.
- The Service and all products and services delivered to you through the Service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties, or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.

## **7. Modifications to the Service and Prices**
- Hartsy AI reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time. You agree that Hartsy AI shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.

## **8. Governing Law**
- This Agreement and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of United States of America.

## **9. Changes to Terms**
- We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.

### Last Updated: January 11th, 2024

### **Thank you for choosing Hartsy AI for your creative journey! Explore, create, and be inspired.**
`;

export default async function TermsPage() {
  return (
    <div className="mt-20">
      <div className="prose-xl mb-10">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
