import React from 'react';
import SEOHead from './SEOHead';
import { Language } from '../types';

interface TermsOfServicePageProps {
  language: Language;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ language }) => {
  const isZh = language === 'zh';

  return (
    <>
      <SEOHead
        title={isZh ? '服务条款 - 神秘塔罗 AI' : 'Terms of Service - Mystic Tarot AI'}
        description={isZh
          ? '神秘塔罗 AI 的服务条款，了解使用本服务的规则和限制。'
          : 'Terms of Service for Mystic Tarot AI. Learn about the rules and restrictions for using our service.'}
        url={typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : (isZh ? '/zh/terms' : '/terms')}
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
              {isZh ? '服务条款' : 'Terms of Service'}
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
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">1. 接受条款</h2>
                    <p className="leading-relaxed">
                      欢迎使用神秘塔罗 AI！通过访问或使用我们的网站和服务（统称为"服务"），您同意受本服务条款（"条款"）的约束。如果您不同意这些条款，请勿使用我们的服务。
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-purple-200">年龄要求：</strong>您必须年满 18 周岁才能使用本服务。使用本服务即表示您确认您已年满 18 周岁。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">2. 服务描述</h2>
                    <p className="leading-relaxed">
                      神秘塔罗 AI 提供基于人工智能的塔罗牌占卜服务。我们的平台使用先进的 AI 模型（由阿里云百炼 Qwen 提供支持）来生成塔罗牌解读和指引。
                    </p>
                    <p className="leading-relaxed mt-3">
                      我们保留随时修改、暂停或终止服务或其任何部分的权利，恕不另行通知。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">3. 娱乐性质免责声明</h2>
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-4">
                      <p className="leading-relaxed font-semibold text-amber-200">
                        ⚠️ 重要提示：本服务仅供娱乐目的使用
                      </p>
                      <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                        <li>我们的塔罗解读是由 <strong>AI 生成</strong>，而非真人占卜师提供。</li>
                        <li>塔罗占卜<strong>不应作为专业建议的替代品</strong>，包括但不限于医疗、法律、财务或心理咨询建议。</li>
                        <li>请勿根据塔罗解读做出重大的人生决策。如有需要，请咨询合格的专业人士。</li>
                        <li>我们不保证任何解读的准确性、完整性或适用性。</li>
                        <li>使用本服务的风险由您自行承担。</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">4. 用户账户</h2>
                    <p className="leading-relaxed mb-3">使用本服务需要创建账户：</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>账户创建</strong>：您可以通过 Google 登录免费创建账户。</li>
                      <li><strong>账户安全</strong>：您有责任保护您的账户安全。请勿与他人分享您的登录凭据。</li>
                      <li><strong>准确信息</strong>：您同意提供准确、完整和最新的信息。</li>
                      <li><strong>账户活动</strong>：您对您账户下发生的所有活动负责。</li>
                      <li><strong>账户终止</strong>：我们保留出于任何原因暂停或终止您的账户的权利，包括违反这些条款。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">5. 订阅和付费服务</h2>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">5.1 免费服务</h3>
                    <p className="leading-relaxed">
                      我们提供有限的免费服务，包括每日占卜次数限制和基本的命题管理功能。
                    </p>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">5.2 会员订阅</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>订阅计划</strong>：我们提供月度会员订阅，解锁高级功能，包括更多占卜次数、更多命题和事件记录。</li>
                      <li><strong>自动续订</strong>：订阅会自动续订，除非您在当前计费周期结束前至少 24 小时取消。</li>
                      <li><strong>计费</strong>：订阅费用将在每个计费周期结束前 24 小时向您的支付方式收取。</li>
                      <li><strong>价格变动</strong>：我们保留随时更改订阅价格的权利。价格变动将在您下一个计费周期生效。</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">5.3 支付和退款</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>支付处理</strong>：所有支付通过第三方支付处理商（Creem）处理。</li>
                      <li><strong>退款政策</strong>：所有销售均为最终销售。我们不提供部分月份的退款。</li>
                      <li><strong>取消订阅</strong>：您可以随时在账户设置中取消订阅。取消后，您将继续享有服务直到当前计费周期结束。</li>
                      <li><strong>会员码兑换</strong>：通过会员码激活的会员资格不可退款，有效期从兑换之日起计算。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">6. 知识产权</h2>
                    <p className="leading-relaxed">
                      本服务及其所有内容、功能和特性（包括但不限于所有信息、软件、文本、显示、图像、视频和音频，以及其设计、选择和排列）均由我们或我们的许可方拥有，并受国际版权、商标、专利、商业秘密和其他知识产权或专有权法律的保护。
                    </p>
                    <p className="leading-relaxed mt-3">
                      <strong className="text-purple-200">您同意不得：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
                      <li>未经我们事先书面许可，复制、修改、分发、展示或表演本服务的任何部分。</li>
                      <li>对本服务进行反向工程、反编译或反汇编。</li>
                      <li>删除或修改任何版权、商标或其他专有权通知。</li>
                      <li>将本服务用于任何商业目的或以任何非法方式使用。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">7. 用户内容和行为</h2>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">7.1 您的内容</h3>
                    <p className="leading-relaxed">
                      您保留对您创建、提交或显示在服务上的任何内容（例如占卜问题、命题）的权利。通过提交内容，您授予我们全球性、非排他性、免版税的许可，以使用、复制、修改、发布和展示该内容以提供服务。
                    </p>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">7.2 禁止行为</h3>
                    <p className="leading-relaxed mb-3">您同意不得：</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li>使用服务从事任何非法活动或违反任何法律法规。</li>
                      <li>发布或传输任何骚扰性、诽谤性、淫秽、威胁性或侵犯他人权利的内容。</li>
                      <li>试图未经授权访问服务的任何部分或其他用户的账户。</li>
                      <li>干扰或破坏服务的完整性或性能。</li>
                      <li>使用自动化系统（如机器人、爬虫）访问服务，除非得到我们的明确许可。</li>
                      <li>绕过服务的任何安全功能或访问控制。</li>
                      <li>滥用或操纵免费试用、会员码或促销优惠。</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">8. 第三方服务</h2>
                    <p className="leading-relaxed">
                      我们的服务可能包含指向第三方网站或服务的链接，或集成第三方服务（如 Google 登录、支付处理器）。我们不控制这些第三方服务，也不对其内容、隐私政策或做法负责。使用第三方服务需遵守其各自的服务条款。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">9. 免责声明</h2>
                    <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4 my-4">
                      <p className="leading-relaxed font-semibold text-slate-200 uppercase">
                        本服务按"原样"和"可用"基础提供，不提供任何明示或暗示的保证，包括但不限于：
                      </p>
                      <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                        <li>适销性、特定用途的适用性或非侵权性的暗示保证。</li>
                        <li>服务将无错误、安全或不间断运行的保证。</li>
                        <li>通过服务获得的任何信息或建议的准确性或可靠性的保证。</li>
                        <li>服务中的任何缺陷将得到纠正的保证。</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">10. 责任限制</h2>
                    <p className="leading-relaxed">
                      在法律允许的最大范围内，我们及我们的董事、员工、合作伙伴、代理商、供应商或关联公司不对因使用或无法使用服务而引起的任何间接、附带、特殊、后果性或惩罚性损害承担责任，包括但不限于：
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li>利润、收入、数据或其他无形资产的损失</li>
                      <li>替代服务的采购成本</li>
                      <li>业务中断或声誉损害</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      在任何情况下，我们对您的总责任不得超过您在过去 12 个月内为服务支付的金额，或者如果您没有支付任何费用，则不超过 100 元人民币。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">11. 赔偿</h2>
                    <p className="leading-relaxed">
                      您同意就因以下情况引起的或与之相关的任何索赔、损害、损失、责任、成本和费用（包括合理的律师费）对我们及我们的关联公司、董事、员工和代理商进行辩护、赔偿并使其免受损害：
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li>您使用或滥用服务</li>
                      <li>您违反这些条款</li>
                      <li>您侵犯任何第三方的权利</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">12. 服务条款的变更</h2>
                    <p className="leading-relaxed">
                      我们保留随时修改或替换这些条款的权利。如果修订是实质性的，我们将在新条款生效前至少 30 天提供通知。什么构成实质性变更将由我们自行决定。
                    </p>
                    <p className="leading-relaxed mt-3">
                      在这些修订生效后继续访问或使用我们的服务，即表示您同意受修订后的条款约束。如果您不同意新条款，请停止使用服务。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">13. 终止</h2>
                    <p className="leading-relaxed">
                      我们可以立即终止或暂停您的账户和访问服务的权限，恕不另行通知，原因包括但不限于违反这些条款。
                    </p>
                    <p className="leading-relaxed mt-3">
                      您可以随时通过停止使用服务和删除您的账户来终止这些条款。
                    </p>
                    <p className="leading-relaxed mt-3">
                      终止后，所有应根据其性质在终止后继续有效的条款将继续有效，包括所有权条款、保证免责声明、赔偿和责任限制。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">14. 适用法律和争议解决</h2>
                    <p className="leading-relaxed">
                      这些条款应受中华人民共和国法律管辖并按其解释，不考虑其法律冲突规定。
                    </p>
                    <p className="leading-relaxed mt-3">
                      因这些条款或服务引起的或与之相关的任何争议应首先通过友好协商解决。如果协商失败，任何一方可将争议提交至有管辖权的人民法院解决。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">15. 可分割性</h2>
                    <p className="leading-relaxed">
                      如果这些条款的任何条款被有管辖权的法院认定为无效或不可执行，该条款将在必要的最小范围内被删除或限制，以使这些条款的其余部分继续完全有效。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">16. 完整协议</h2>
                    <p className="leading-relaxed">
                      这些条款以及我们的隐私政策构成您与我们之间关于服务的完整协议，并取代所有先前或同时期的口头或书面协议和理解。
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">17. 联系我们</h2>
                    <p className="leading-relaxed">
                      如果您对这些服务条款有任何疑问，请通过以下方式联系我们：
                    </p>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                      <p className="text-purple-200">
                        <strong>神秘塔罗 AI</strong><br />
                        电子邮件：<a href="mailto:support@ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">support@ai-tarotcards.vercel.app</a><br />
                        网站：<a href="https://ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">https://ai-tarotcards.vercel.app</a>
                      </p>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  {/* English Version */}
                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">1. Acceptance of Terms</h2>
                    <p className="leading-relaxed">
                      Welcome to Mystic Tarot AI! By accessing or using our website and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-purple-200">Age Requirement:</strong> You must be at least 18 years old to use this Service. By using the Service, you confirm that you are at least 18 years old.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">2. Service Description</h2>
                    <p className="leading-relaxed">
                      Mystic Tarot AI provides artificial intelligence-powered tarot card reading services. Our platform uses advanced AI models (powered by Alibaba Cloud Bailian Qwen) to generate tarot card interpretations and guidance.
                    </p>
                    <p className="leading-relaxed mt-3">
                      We reserve the right to modify, suspend, or discontinue the Service or any part thereof at any time without notice.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">3. Entertainment Disclaimer</h2>
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 my-4">
                      <p className="leading-relaxed font-semibold text-amber-200">
                        ⚠️ Important: This Service is for Entertainment Purposes Only
                      </p>
                      <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                        <li>Our tarot readings are <strong>AI-generated</strong>, not provided by human psychics.</li>
                        <li>Tarot readings <strong>should not be used as a substitute for professional advice</strong>, including but not limited to medical, legal, financial, or psychological counseling.</li>
                        <li>Do not make major life decisions based on tarot readings. Consult qualified professionals when needed.</li>
                        <li>We do not guarantee the accuracy, completeness, or applicability of any reading.</li>
                        <li>Use of this Service is at your own risk.</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">4. User Accounts</h2>
                    <p className="leading-relaxed mb-3">Using the Service requires creating an account:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Account Creation</strong>: You can create a free account by logging in with Google.</li>
                      <li><strong>Account Security</strong>: You are responsible for safeguarding your account. Do not share your login credentials with others.</li>
                      <li><strong>Accurate Information</strong>: You agree to provide accurate, complete, and current information.</li>
                      <li><strong>Account Activity</strong>: You are responsible for all activities that occur under your account.</li>
                      <li><strong>Account Termination</strong>: We reserve the right to suspend or terminate your account for any reason, including violation of these Terms.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">5. Subscriptions and Paid Services</h2>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">5.1 Free Service</h3>
                    <p className="leading-relaxed">
                      We offer limited free service, including daily reading limits and basic topic management features.
                    </p>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">5.2 Membership Subscription</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Subscription Plans</strong>: We offer monthly membership subscriptions that unlock premium features, including more readings, topics, and event records.</li>
                      <li><strong>Auto-Renewal</strong>: Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period.</li>
                      <li><strong>Billing</strong>: Subscription fees are charged to your payment method 24 hours before the end of each billing period.</li>
                      <li><strong>Price Changes</strong>: We reserve the right to change subscription prices at any time. Price changes will take effect in your next billing cycle.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">5.3 Payment and Refunds</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Payment Processing</strong>: All payments are processed through a third-party payment processor (Creem).</li>
                      <li><strong>Refund Policy</strong>: All sales are final. We do not offer refunds for partial months.</li>
                      <li><strong>Cancellation</strong>: You can cancel your subscription at any time in your account settings. After cancellation, you will continue to have access until the end of the current billing period.</li>
                      <li><strong>Membership Code Redemption</strong>: Memberships activated through redemption codes are non-refundable and valid from the redemption date.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">6. Intellectual Property</h2>
                    <p className="leading-relaxed">
                      The Service and all of its content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by us or our licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>
                    <p className="leading-relaxed mt-3">
                      <strong className="text-purple-200">You agree not to:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
                      <li>Reproduce, modify, distribute, display, or perform any part of the Service without our prior written permission.</li>
                      <li>Reverse engineer, decompile, or disassemble the Service.</li>
                      <li>Remove or modify any copyright, trademark, or other proprietary rights notices.</li>
                      <li>Use the Service for any commercial purposes or in any illegal manner.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">7. User Content and Conduct</h2>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">7.1 Your Content</h3>
                    <p className="leading-relaxed">
                      You retain rights to any content you create, submit, or display on the Service (e.g., reading questions, topics). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and display that content to provide the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-3">7.2 Prohibited Conduct</h3>
                    <p className="leading-relaxed mb-3">You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li>Use the Service for any illegal activities or to violate any laws or regulations.</li>
                      <li>Post or transmit any harassing, defamatory, obscene, threatening, or rights-infringing content.</li>
                      <li>Attempt to gain unauthorized access to any part of the Service or other users' accounts.</li>
                      <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                      <li>Use automated systems (such as bots, crawlers) to access the Service unless explicitly permitted by us.</li>
                      <li>Bypass any security features or access controls of the Service.</li>
                      <li>Abuse or manipulate free trials, membership codes, or promotional offers.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">8. Third-Party Services</h2>
                    <p className="leading-relaxed">
                      Our Service may contain links to third-party websites or services, or integrate third-party services (such as Google login, payment processors). We do not control these third-party services and are not responsible for their content, privacy policies, or practices. Use of third-party services is subject to their respective terms of service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">9. Disclaimers</h2>
                    <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4 my-4">
                      <p className="leading-relaxed font-semibold text-slate-200 uppercase">
                        The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                        <li>Implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
                        <li>Guarantees that the Service will operate error-free, securely, or without interruption.</li>
                        <li>Guarantees of accuracy or reliability of any information or advice obtained through the Service.</li>
                        <li>Guarantees that defects in the Service will be corrected.</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">10. Limitation of Liability</h2>
                    <p className="leading-relaxed">
                      To the maximum extent permitted by law, we and our directors, employees, partners, agents, suppliers, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use or inability to use the Service, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li>Loss of profits, revenue, data, or other intangible assets</li>
                      <li>Cost of procuring substitute services</li>
                      <li>Business interruption or reputational harm</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      In any case, our total liability to you shall not exceed the amount you paid for the Service in the past 12 months, or if you have not paid anything, CNY 100.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">11. Indemnification</h2>
                    <p className="leading-relaxed">
                      You agree to defend, indemnify, and hold harmless us and our affiliates, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney fees) arising from or related to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                      <li>Your use or abuse of the Service</li>
                      <li>Your violation of these Terms</li>
                      <li>Your infringement of any third-party rights</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">12. Changes to Terms</h2>
                    <p className="leading-relaxed">
                      We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to the new Terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p className="leading-relaxed mt-3">
                      By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised Terms. If you do not agree to the new Terms, please stop using the Service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">13. Termination</h2>
                    <p className="leading-relaxed">
                      We may terminate or suspend your account and access to the Service immediately, without prior notice, for reasons including but not limited to violation of these Terms.
                    </p>
                    <p className="leading-relaxed mt-3">
                      You may terminate these Terms at any time by discontinuing use of the Service and deleting your account.
                    </p>
                    <p className="leading-relaxed mt-3">
                      Upon termination, all provisions that by their nature should survive termination will remain in effect, including ownership provisions, warranty disclaimers, indemnification, and limitations of liability.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">14. Governing Law and Dispute Resolution</h2>
                    <p className="leading-relaxed">
                      These Terms shall be governed by and construed in accordance with the laws of the People's Republic of China, without regard to its conflict of law provisions.
                    </p>
                    <p className="leading-relaxed mt-3">
                      Any disputes arising from or related to these Terms or the Service shall first be resolved through friendly negotiation. If negotiation fails, either party may submit the dispute to a court of competent jurisdiction for resolution.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">15. Severability</h2>
                    <p className="leading-relaxed">
                      If any provision of these Terms is found invalid or unenforceable by a court of competent jurisdiction, that provision shall be deleted or limited to the minimum extent necessary, so that the remaining Terms continue in full force and effect.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">16. Entire Agreement</h2>
                    <p className="leading-relaxed">
                      These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede all prior or contemporaneous oral or written agreements and understandings.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4">17. Contact Us</h2>
                    <p className="leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                      <p className="text-purple-200">
                        <strong>Mystic Tarot AI</strong><br />
                        Email: <a href="mailto:support@ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">support@ai-tarotcards.vercel.app</a><br />
                        Website: <a href="https://ai-tarotcards.vercel.app" className="text-purple-400 hover:text-purple-300">https://ai-tarotcards.vercel.app</a>
                      </p>
                    </div>
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
