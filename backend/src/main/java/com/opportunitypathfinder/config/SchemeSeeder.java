package com.opportunitypathfinder.config;

import com.opportunitypathfinder.model.Scheme;
import com.opportunitypathfinder.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class SchemeSeeder implements ApplicationRunner {

    private final SchemeRepository repo;

    @Override
    public void run(ApplicationArguments args) {
        if (repo.count() > 0) return;

        repo.saveAll(List.of(

            // ── EDUCATION ──────────────────────────────────────────────────
            scheme("PM YASASVI Scholarship Scheme",
                "Ministry of Social Justice and Empowerment", "EDUCATION",
                "Scholarship for OBC, EBC and DNT students for studying in top schools and colleges.",
                "Covers tuition fees, hostel charges, and other expenses up to ₹1,25,000/year",
                "OBC", "ANY", 250000.0, 15, 29, "STUDENT", "",
                "https://yet.nta.ac.in", "ONLINE",
                "Aadhaar,Income Certificate,Caste Certificate,Marksheet,Bank Passbook"),

            scheme("Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
                "Ministry of Skill Development and Entrepreneurship", "EMPLOYMENT",
                "Free skill training and certification for youth to improve employability.",
                "Free short-term skill training in 300+ job roles, certification, and placement assistance",
                "ALL", "ANY", 0.0, 15, 45, "UNEMPLOYED", "",
                "https://www.pmkvyofficial.org", "OFFLINE",
                "Aadhaar,Bank Passbook,Passport Photo"),

            scheme("Startup India Seed Fund Scheme",
                "Department for Promotion of Industry and Internal Trade", "FINANCE",
                "Financial assistance to startups for proof of concept, prototype development, and market entry.",
                "Up to ₹20 lakh for validation, ₹50 lakh for market entry",
                "ALL", "ANY", 0.0, 18, 45, "SELF_EMPLOYED", "",
                "https://seedfund.startupindia.gov.in", "ONLINE",
                "Aadhaar,PAN Card,Business Registration,Bank Account"),

            scheme("PM Mudra Yojana (PMMY)",
                "Ministry of Finance", "FINANCE",
                "Loans for non-corporate, non-farm small/micro enterprises. Three categories: Shishu (up to ₹50K), Kishore (₹50K–5L), Tarun (₹5L–10L).",
                "Collateral-free loans: Shishu ₹50,000 | Kishore ₹5,00,000 | Tarun ₹10,00,000",
                "ALL", "ANY", 0.0, 18, 65, "SELF_EMPLOYED", "",
                "https://www.mudra.org.in", "BOTH",
                "Aadhaar,PAN Card,Business Plan,Bank Statement,Address Proof"),

            scheme("Atal Innovation Mission (AIM)",
                "NITI Aayog", "EDUCATION",
                "Promotes innovation and entrepreneurship among students through Atal Tinkering Labs.",
                "Grants up to ₹20 lakh for setting up tinkering labs, mentorship, and innovation challenges",
                "ALL", "ANY", 0.0, 10, 25, "STUDENT", "",
                "https://aim.gov.in", "ONLINE",
                "Aadhaar,School/College ID,Project Proposal"),

            scheme("PM Awas Yojana - Urban (PMAY-U)",
                "Ministry of Housing and Urban Affairs", "HOUSING",
                "Housing for all urban poor — interest subsidy on home loans for EWS/LIG/MIG categories.",
                "Interest subsidy of 3–6.5% on home loans; EWS/LIG up to ₹6 lakh, MIG up to ₹12 lakh",
                "EWS", "ANY", 1800000.0, 18, 70, "ANY", "",
                "https://pmaymis.gov.in", "ONLINE",
                "Aadhaar,Income Certificate,Bank Statement,Property Documents"),

            scheme("Ayushman Bharat - PM Jan Arogya Yojana",
                "Ministry of Health and Family Welfare", "HEALTH",
                "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary hospitalization.",
                "₹5,00,000 health cover per family per year, cashless treatment at empanelled hospitals",
                "ALL", "ANY", 500000.0, 0, 100, "ANY", "",
                "https://pmjay.gov.in", "ONLINE",
                "Aadhaar,Ration Card,Income Certificate"),

            scheme("National Career Service (NCS) Portal",
                "Ministry of Labour and Employment", "EMPLOYMENT",
                "Online platform connecting job seekers with employers, career counselling, and skill development.",
                "Free job matching, career counselling, apprenticeship opportunities, and skill courses",
                "ALL", "ANY", 0.0, 18, 45, "UNEMPLOYED", "",
                "https://www.ncs.gov.in", "ONLINE",
                "Aadhaar,Educational Certificates,Resume"),

            scheme("Stand Up India",
                "Ministry of Finance", "FINANCE",
                "Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.",
                "Loans ₹10 lakh to ₹1 crore for greenfield enterprises in manufacturing, services, or trading",
                "SC", "ANY", 0.0, 18, 65, "SELF_EMPLOYED", "",
                "https://www.standupmitra.in", "ONLINE",
                "Aadhaar,PAN Card,Caste Certificate,Business Plan,Bank Account"),

            scheme("PM SVANidhi (Street Vendor Loan)",
                "Ministry of Housing and Urban Affairs", "FINANCE",
                "Micro-credit facility for street vendors to resume livelihoods affected by COVID-19.",
                "Working capital loans: ₹10,000 (1st), ₹20,000 (2nd), ₹50,000 (3rd) with interest subsidy",
                "ALL", "ANY", 0.0, 18, 65, "SELF_EMPLOYED", "",
                "https://pmsvanidhi.mohua.gov.in", "ONLINE",
                "Aadhaar,Vendor Certificate,Bank Account"),

            scheme("Skill India Digital (SID)",
                "Ministry of Skill Development and Entrepreneurship", "EMPLOYMENT",
                "Digital platform for skill development, online courses, and industry-recognized certifications.",
                "Free access to 500+ skill courses, digital certificates, and job placement support",
                "ALL", "ANY", 0.0, 15, 45, "ANY", "",
                "https://skillindia.gov.in", "ONLINE",
                "Aadhaar,Bank Passbook"),

            scheme("National Apprenticeship Promotion Scheme (NAPS)",
                "Ministry of Skill Development and Entrepreneurship", "EMPLOYMENT",
                "Promotes apprenticeship training by sharing stipend cost between government and employers.",
                "25% stipend reimbursement to employers, basic training support up to ₹7,500",
                "ALL", "ANY", 0.0, 14, 35, "STUDENT", "",
                "https://apprenticeshipindia.gov.in", "ONLINE",
                "Aadhaar,Educational Certificate,Bank Account"),

            scheme("PM Scholarship Scheme for RPF/RPSF",
                "Ministry of Railways", "EDUCATION",
                "Scholarship for wards of RPF/RPSF personnel for professional degree courses.",
                "₹2,250/month for boys, ₹2,500/month for girls pursuing professional courses",
                "ALL", "ANY", 0.0, 17, 25, "STUDENT", "",
                "https://scholarships.gov.in", "ONLINE",
                "Aadhaar,Service Certificate,Marksheet,Bank Passbook"),

            scheme("Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
                "Ministry of Rural Development", "EMPLOYMENT",
                "Skill training and placement for rural youth from poor families.",
                "Free residential skill training, placement in formal sector jobs with minimum ₹6,000/month salary",
                "ALL", "ANY", 300000.0, 15, 35, "UNEMPLOYED", "",
                "https://ddugky.gov.in", "OFFLINE",
                "Aadhaar,Income Certificate,BPL Card,Bank Passbook"),

            scheme("National Means-cum-Merit Scholarship (NMMS)",
                "Ministry of Education", "EDUCATION",
                "Scholarship to arrest dropout at Class 8 level and encourage meritorious students to continue education.",
                "₹12,000/year (₹1,000/month) for Class 9 to 12 students",
                "ALL", "ANY", 350000.0, 13, 18, "STUDENT", "",
                "https://scholarships.gov.in", "ONLINE",
                "Aadhaar,Income Certificate,Class 7 Marksheet,Bank Passbook"),

            scheme("Pradhan Mantri Jan Dhan Yojana (PMJDY)",
                "Ministry of Finance", "FINANCE",
                "Financial inclusion — zero balance bank accounts with RuPay debit card and accident insurance.",
                "Zero balance account, RuPay card, ₹1 lakh accident insurance, ₹30,000 life cover, overdraft up to ₹10,000",
                "ALL", "ANY", 0.0, 10, 65, "ANY", "",
                "https://pmjdy.gov.in", "BOTH",
                "Aadhaar,PAN Card or Form 60,Passport Photo"),

            scheme("Beti Bachao Beti Padhao",
                "Ministry of Women and Child Development", "SOCIAL",
                "Scheme to address declining child sex ratio and promote welfare of girl child.",
                "Sukanya Samriddhi Account with 8.2% interest, tax benefits, and maturity amount for education/marriage",
                "ALL", "FEMALE", 0.0, 0, 10, "ANY", "",
                "https://wcd.nic.in/bbbp-schemes", "BOTH",
                "Aadhaar,Birth Certificate,Bank Account"),

            scheme("PM Kisan Samman Nidhi",
                "Ministry of Agriculture", "AGRICULTURE",
                "Income support of ₹6,000/year to all landholding farmer families.",
                "₹6,000/year in 3 equal installments of ₹2,000 directly to bank account",
                "FARMER", "ANY", 0.0, 18, 80, "FARMER", "",
                "https://pmkisan.gov.in", "ONLINE",
                "Aadhaar,Land Records,Bank Passbook"),

            scheme("Sukanya Samriddhi Yojana",
                "Ministry of Finance", "FINANCE",
                "Small savings scheme for girl child education and marriage expenses.",
                "8.2% interest rate, tax-free maturity, minimum ₹250/year deposit",
                "ALL", "FEMALE", 0.0, 0, 10, "ANY", "",
                "https://www.indiapost.gov.in", "BOTH",
                "Aadhaar,Birth Certificate of Girl Child,Parent ID Proof"),

            scheme("National Social Assistance Programme (NSAP)",
                "Ministry of Rural Development", "SOCIAL",
                "Social protection for BPL households — old age, widow, and disability pensions.",
                "₹200–₹500/month pension for elderly, widows, and disabled persons below poverty line",
                "ALL", "ANY", 0.0, 60, 100, "ANY", "",
                "https://nsap.nic.in", "OFFLINE",
                "Aadhaar,BPL Card,Age Proof,Bank Passbook"),

            scheme("PM Ujjwala Yojana",
                "Ministry of Petroleum and Natural Gas", "SOCIAL",
                "Free LPG connections to women from BPL households to replace unclean cooking fuels.",
                "Free LPG connection with first refill and stove, subsidized refills",
                "ALL", "FEMALE", 200000.0, 18, 65, "ANY", "",
                "https://pmuy.gov.in", "OFFLINE",
                "Aadhaar,BPL/Ration Card,Bank Passbook,Passport Photo"),

            scheme("Atal Pension Yojana (APY)",
                "Ministry of Finance", "FINANCE",
                "Pension scheme for unorganized sector workers guaranteeing ₹1,000–₹5,000/month pension.",
                "Guaranteed pension ₹1,000–₹5,000/month after age 60, government co-contribution for eligible subscribers",
                "ALL", "ANY", 0.0, 18, 40, "ANY", "",
                "https://npscra.nsdl.co.in", "BOTH",
                "Aadhaar,Bank Account,Mobile Number"),

            scheme("PM Employment Generation Programme (PMEGP)",
                "Ministry of MSME", "EMPLOYMENT",
                "Credit-linked subsidy for setting up micro enterprises in non-farm sector.",
                "Subsidy 15–35% of project cost (up to ₹25 lakh manufacturing, ₹10 lakh service)",
                "ALL", "ANY", 0.0, 18, 55, "UNEMPLOYED", "",
                "https://www.kviconline.gov.in/pmegpeportal", "ONLINE",
                "Aadhaar,PAN Card,Educational Certificate,Project Report,Bank Account"),

            scheme("National Rural Livelihood Mission (NRLM - DAY)",
                "Ministry of Rural Development", "EMPLOYMENT",
                "Self-employment and skill development for rural poor through Self Help Groups.",
                "Interest subvention on SHG loans, skill training, market linkages, and livelihood support",
                "ALL", "ANY", 200000.0, 18, 60, "UNEMPLOYED", "",
                "https://aajeevika.gov.in", "OFFLINE",
                "Aadhaar,BPL Card,Bank Passbook,SHG Membership"),

            scheme("e-SHRAM Portal",
                "Ministry of Labour and Employment", "SOCIAL",
                "National database of unorganized workers with ₹2 lakh accident insurance.",
                "₹2 lakh accident insurance, priority access to social security schemes, UAN card",
                "ALL", "ANY", 0.0, 16, 59, "ANY", "",
                "https://eshram.gov.in", "ONLINE",
                "Aadhaar,Bank Account,Mobile Number linked to Aadhaar")
        ));
    }

    private Scheme scheme(String name, String ministry, String category, String description,
                           String benefits, String targetGroup, String gender, Double maxIncome,
                           Integer minAge, Integer maxAge, String employment, String state,
                           String applyUrl, String applyMode, String docs) {
        Scheme s = new Scheme();
        s.setName(name);
        s.setMinistry(ministry);
        s.setSchemeCategory(category);
        s.setDescription(description);
        s.setBenefits(benefits);
        s.setTargetGroup(targetGroup);
        s.setGenderRequired(gender);
        s.setMaxAnnualIncome(maxIncome);
        s.setMinAge(minAge);
        s.setMaxAge(maxAge);
        s.setEmploymentStatus(employment);
        s.setStateSpecific(state);
        s.setApplyUrl(applyUrl);
        s.setApplyMode(applyMode);
        s.setRequiredDocuments(docs);
        return s;
    }
}
