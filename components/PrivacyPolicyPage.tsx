import React from 'react';
import SEOHead from './SEOHead';
import { Language } from '../types';

interface PrivacyPolicyPageProps {
  language: Language;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ language }) => {
  const isZh = language === 'zh';

  return (
    <>
      <SEOHead
        title={isZh ? '隐私政策 - 神秘塔罗 AI' : 'Privacy Policy - Mystic Tarot AI'}
        description={isZh
          ? '神秘塔罗 AI 的隐私政策，了解我们如何收集、使用和保护您的个人信息。'
          : 'Privacy Policy for Mystic Tarot AI. Learn how we collect, use, and protect your personal information.'}
        url={typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : (isZh ? '/zh/privacy' : '/privacy')}
        lang={isZh ? 'zh-CN' : 'en'}
        schemaType="WebSite"
      />

      <div className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 relative overflow-hidden">
        {/* Starry Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1041px', top: '512px' }} />
          <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1801px', top: '8px' }} />
          <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1337px', top: '464px' }} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 md:p-10">
            {/* Header */}
            <h1 className="text-3xl md:text-4xl font-bold text-purple-200 mb-2">
              {isZh ? '隐私政策' : 'Privacy Policy'}
            </h1>
            <p className="text-sm text-slate-400 mb-8">
              {isZh ? '最后更新日期：2025年1月' : 'Last Updated: January 2025'}
            </p>

            {/* Content */}
            <div className="prose prose-invert prose-purple max-w-none space-y-8 text-slate-300">

              {isZh ? (
                <>
                  {/* 中文版本 */}
                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">1. 引言</h2>
                    <p className="leading-relaxed">
                      欢迎使用神秘塔罗 AI（以下简称"我们"、"本网站"或"本服务"）。我们非常重视您的隐私和个人信息安全。本隐私政策说明了我们如何收集、使用、存储和保护您在使用我们的 AI 塔罗占卜服务时提供的信息。
                    </p>
                    <p className="leading-relaxed">
                      使用本服务即表示您同意本隐私政策中描述的做法。如果您不同意本政策，请勿使用我们的服务。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">2. 我们收集的信息</h2>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">2.1 您主动提供的信息</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>账户信息</strong>：当您通过 Google 登录时，我们会收集您的电子邮件地址、姓名和个人资料照片。</li>
                      <li><strong>占卜问题</strong>：您在进行塔罗占卜时输入的问题和命题。</li>
                      <li><strong>支付信息</strong>：如果您购买会员服务，我们通过第三方支付处理商（Creem）处理支付信息，我们不会直接存储您的支付卡详细信息。</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">2.2 自动收集的信息</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>使用数据</strong>：包括 IP 地址、浏览器类型、设备信息、访问时间和页面浏览记录。</li>
                      <li><strong>Cookie 和追踪技术</strong>：我们使用 Google Analytics 来分析网站使用情况，以改善我们的服务。</li>
                      <li><strong>占卜历史</strong>：您的占卜记录、抽取的卡牌和 AI 生成的解读结果。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">3. 我们如何使用您的信息</h2>
                    <p className="leading-relaxed mb-3">我们使用收集的信息用于以下目的：</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>提供和维护服务</strong>：处理您的占卜请求，管理您的账户和会员资格。</li>
                      <li><strong>改进服务</strong>：分析使用模式以优化用户体验和 AI 解读质量。</li>
                      <li><strong>客户支持</strong>：响应您的咨询和技术支持请求。</li>
                      <li><strong>通信</strong>：发送服务相关通知、更新和促销信息（您可以随时退订）。</li>
                      <li><strong>安全和防欺诈</strong>：检测和防止滥用、欺诈行为和安全威胁。</li>
                      <li><strong>法律合规</strong>：遵守适用的法律、法规和法律程序。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">4. 信息共享和披露</h2>
                    <p className="leading-relaxed mb-3">我们不会出售或出租您的个人信息。我们可能在以下情况下共享您的信息：</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>服务提供商</strong>：与帮助我们运营服务的第三方合作伙伴，包括：
                        <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                          <li>阿里云百炼（AI 模型提供商）</li>
                          <li>Neon（数据库托管）</li>
                          <li>Vercel（网站托管）</li>
                          <li>Google（身份验证和分析）</li>
                          <li>Creem（支付处理）</li>
                        </ul>
                      </li>
                      <li><strong>法律要求</strong>：当法律要求或为保护我们的权利、财产或安全时。</li>
                      <li><strong>业务转让</strong>：在合并、收购或资产出售的情况下。</li>
                      <li><strong>经您同意</strong>：在您明确同意的其他情况下。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">5. 数据安全</h2>
                    <p className="leading-relaxed">
                      我们采取合理的技术和组织措施来保护您的个人信息免遭未经授权的访问、使用、更改或披露。这包括：
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li>使用 SSL/TLS 加密传输数据</li>
                      <li>安全的 httpOnly Cookie 保护会话信息</li>
                      <li>定期安全审计和漏洞扫描</li>
                      <li>限制员工访问个人数据</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      但是，请注意，没有任何互联网传输或电子存储方法是 100% 安全的。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">6. 数据保留</h2>
                    <p className="leading-relaxed">
                      我们仅在实现本隐私政策中所述目的所需的时间内保留您的个人信息。具体而言：
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li><strong>账户信息</strong>：在您的账户处于活动状态期间保留，删除账户后 30 天内删除。</li>
                      <li><strong>占卜记录</strong>：在您删除命题或账户时删除，或在最后一次活动后 2 年自动删除。</li>
                      <li><strong>使用数据</strong>：通常保留 12-24 个月用于分析目的。</li>
                      <li><strong>法律义务</strong>：某些数据可能需要保留更长时间以遵守法律要求。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">7. 您的权利</h2>
                    <p className="leading-relaxed mb-3">根据适用的数据保护法律，您拥有以下权利：</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>访问权</strong>：请求查看我们持有的关于您的个人信息。</li>
                      <li><strong>更正权</strong>：请求更正不准确或不完整的信息。</li>
                      <li><strong>删除权</strong>：请求删除您的个人信息（"被遗忘权"）。</li>
                      <li><strong>限制处理权</strong>：请求限制我们如何使用您的信息。</li>
                      <li><strong>数据可移植权</strong>：以结构化、常用的格式接收您的数据。</li>
                      <li><strong>反对权</strong>：反对出于特定目的处理您的信息。</li>
                      <li><strong>撤回同意权</strong>：随时撤回您之前给予的同意。</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      如需行使这些权利，请通过下方联系方式与我们联系。我们将在 30 天内回复您的请求。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">8. Cookie 和追踪技术</h2>
                    <p className="leading-relaxed mb-3">我们使用以下类型的 Cookie：</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>必要 Cookie</strong>：用于身份验证和会话管理（无法禁用）。</li>
                      <li><strong>分析 Cookie</strong>：Google Analytics 用于了解用户如何使用我们的服务。</li>
                      <li><strong>功能 Cookie</strong>：记住您的语言偏好和设置。</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      您可以通过浏览器设置管理 Cookie 偏好，但禁用某些 Cookie 可能会影响网站功能。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">9. 儿童隐私</h2>
                    <p className="leading-relaxed">
                      我们的服务不面向 18 岁以下的儿童。我们不会有意收集 18 岁以下儿童的个人信息。如果我们发现无意中收集了儿童的信息，我们将立即删除该信息。如果您认为我们可能持有儿童的信息，请联系我们。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">10. 国际数据传输</h2>
                    <p className="leading-relaxed">
                      您的信息可能会被传输到并维护在您所在国家/地区以外的计算机上，那里的数据保护法律可能与您所在司法管辖区的法律不同。通过使用我们的服务，您同意将您的信息传输到这些地点。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">11. 第三方链接</h2>
                    <p className="leading-relaxed">
                      我们的服务可能包含指向第三方网站的链接。我们不对这些网站的隐私做法负责。我们建议您阅读您访问的每个网站的隐私政策。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">12. 隐私政策的变更</h2>
                    <p className="leading-relaxed">
                      我们可能会不时更新本隐私政策。我们将通过在本页面上发布新的隐私政策来通知您任何更改，并更新"最后更新日期"。重大变更时，我们会通过电子邮件或网站通知提前通知您。
                    </p>
                    <p className="leading-relaxed mt-3">
                      建议您定期查看本隐私政策以了解任何更改。更改在发布到本页面时生效。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">13. 联系我们</h2>
                    <p className="leading-relaxed">
                      如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：
                    </p>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                      <p className="text-purple-200">
                        <strong>神秘塔罗 AI</strong><br />
                        电子邮件：<a href="mailto:support@ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">support@ai-tarotcards.vercel.app</a><br />
                        网站：<a href="https://ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">https://ai-tarotcards.vercel.app</a>
                      </p>
                    </div>
                    <p className="leading-relaxed mt-4">
                      我们将在收到您的请求后 30 天内回复。
                    </p>
                  </section>
                </>
              ) : (
                <>
                  {/* English Version */}
                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">1. Introduction</h2>
                    <p className="leading-relaxed">
                      Welcome to Mystic Tarot AI (referred to as "we," "our," "this website," or "the Service"). We take your privacy and personal information security very seriously. This Privacy Policy explains how we collect, use, store, and protect the information you provide when using our AI tarot reading services.
                    </p>
                    <p className="leading-relaxed">
                      By using the Service, you agree to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">2. Information We Collect</h2>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">2.1 Information You Provide</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Account Information</strong>: When you log in via Google, we collect your email address, name, and profile photo.</li>
                      <li><strong>Reading Questions</strong>: Questions and topics you enter when performing tarot readings.</li>
                      <li><strong>Payment Information</strong>: If you purchase membership services, we process payments through a third-party payment processor (Creem). We do not directly store your payment card details.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">2.2 Automatically Collected Information</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Usage Data</strong>: Including IP address, browser type, device information, access times, and page views.</li>
                      <li><strong>Cookies and Tracking</strong>: We use Google Analytics to analyze website usage to improve our services.</li>
                      <li><strong>Reading History</strong>: Your reading records, drawn cards, and AI-generated interpretations.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">3. How We Use Your Information</h2>
                    <p className="leading-relaxed mb-3">We use collected information for the following purposes:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Provide and Maintain Services</strong>: Process your reading requests, manage your account and membership.</li>
                      <li><strong>Improve Services</strong>: Analyze usage patterns to optimize user experience and AI interpretation quality.</li>
                      <li><strong>Customer Support</strong>: Respond to your inquiries and technical support requests.</li>
                      <li><strong>Communications</strong>: Send service-related notifications, updates, and promotional information (you can unsubscribe anytime).</li>
                      <li><strong>Security and Fraud Prevention</strong>: Detect and prevent abuse, fraud, and security threats.</li>
                      <li><strong>Legal Compliance</strong>: Comply with applicable laws, regulations, and legal processes.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">4. Information Sharing and Disclosure</h2>
                    <p className="leading-relaxed mb-3">We do not sell or rent your personal information. We may share your information in the following circumstances:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Service Providers</strong>: With third-party partners who help us operate our services, including:
                        <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                          <li>Alibaba Cloud Bailian (AI model provider)</li>
                          <li>Neon (database hosting)</li>
                          <li>Vercel (website hosting)</li>
                          <li>Google (authentication and analytics)</li>
                          <li>Creem (payment processing)</li>
                        </ul>
                      </li>
                      <li><strong>Legal Requirements</strong>: When required by law or to protect our rights, property, or safety.</li>
                      <li><strong>Business Transfers</strong>: In case of merger, acquisition, or asset sale.</li>
                      <li><strong>With Your Consent</strong>: In other circumstances with your explicit consent.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">5. Data Security</h2>
                    <p className="leading-relaxed">
                      We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, use, alteration, or disclosure. This includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>Secure httpOnly cookies for session protection</li>
                      <li>Regular security audits and vulnerability scanning</li>
                      <li>Limited employee access to personal data</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      However, please note that no method of internet transmission or electronic storage is 100% secure.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">6. Data Retention</h2>
                    <p className="leading-relaxed">
                      We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Specifically:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li><strong>Account Information</strong>: Retained while your account is active, deleted within 30 days after account deletion.</li>
                      <li><strong>Reading Records</strong>: Deleted when you delete topics or your account, or automatically deleted 2 years after last activity.</li>
                      <li><strong>Usage Data</strong>: Typically retained for 12-24 months for analytical purposes.</li>
                      <li><strong>Legal Obligations</strong>: Some data may need to be retained longer to comply with legal requirements.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">7. Your Rights</h2>
                    <p className="leading-relaxed mb-3">Under applicable data protection laws, you have the following rights:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Right to Access</strong>: Request to view personal information we hold about you.</li>
                      <li><strong>Right to Rectification</strong>: Request correction of inaccurate or incomplete information.</li>
                      <li><strong>Right to Erasure</strong>: Request deletion of your personal information ("right to be forgotten").</li>
                      <li><strong>Right to Restriction</strong>: Request to limit how we use your information.</li>
                      <li><strong>Right to Data Portability</strong>: Receive your data in a structured, commonly used format.</li>
                      <li><strong>Right to Object</strong>: Object to processing your information for specific purposes.</li>
                      <li><strong>Right to Withdraw Consent</strong>: Withdraw previously given consent at any time.</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      To exercise these rights, please contact us using the information below. We will respond to your request within 30 days.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">8. Cookies and Tracking Technologies</h2>
                    <p className="leading-relaxed mb-3">We use the following types of cookies:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Essential Cookies</strong>: Used for authentication and session management (cannot be disabled).</li>
                      <li><strong>Analytics Cookies</strong>: Google Analytics to understand how users interact with our services.</li>
                      <li><strong>Functional Cookies</strong>: Remember your language preferences and settings.</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      You can manage cookie preferences through your browser settings, but disabling certain cookies may affect website functionality.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">9. Children's Privacy</h2>
                    <p className="leading-relaxed">
                      Our services are not directed to children under 18. We do not knowingly collect personal information from children under 18. If we discover we have inadvertently collected information from a child, we will delete it immediately. If you believe we may have information from a child, please contact us.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">10. International Data Transfers</h2>
                    <p className="leading-relaxed">
                      Your information may be transferred to and maintained on computers located outside your country, where data protection laws may differ from those in your jurisdiction. By using our services, you consent to the transfer of your information to these locations.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">11. Third-Party Links</h2>
                    <p className="leading-relaxed">
                      Our services may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We recommend reading the privacy policy of each website you visit.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">12. Changes to This Privacy Policy</h2>
                    <p className="leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For material changes, we will provide advance notice via email or website notification.
                    </p>
                    <p className="leading-relaxed mt-3">
                      We recommend reviewing this Privacy Policy periodically to stay informed of any changes. Changes become effective when posted on this page.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">13. Contact Us</h2>
                    <p className="leading-relaxed">
                      If you have any questions, comments, or requests regarding this Privacy Policy, please contact us at:
                    </p>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                      <p className="text-purple-200">
                        <strong>Mystic Tarot AI</strong><br />
                        Email: <a href="mailto:support@ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">support@ai-tarotcards.vercel.app</a><br />
                        Website: <a href="https://ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">https://ai-tarotcards.vercel.app</a>
                      </p>
                    </div>
                    <p className="leading-relaxed mt-4">
                      We will respond to your request within 30 days of receipt.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Back Button */}
            <div className="mt-10 pt-6 border-t border-purple-500/20">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {isZh ? '返回首页' : 'Back to Home'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
