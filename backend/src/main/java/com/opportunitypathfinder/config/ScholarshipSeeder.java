package com.opportunitypathfinder.config;

import com.opportunitypathfinder.model.Scholarship;
import com.opportunitypathfinder.repository.ScholarshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ScholarshipSeeder implements ApplicationRunner {

    private final ScholarshipRepository repo;

    @Override
    public void run(ApplicationArguments args) {
        if (repo.count() > 0) return; // already seeded

        repo.saveAll(List.of(

            scholarship("NSP - Post Matric Scholarship (SC Students)",
                "National Scholarship Portal / Ministry of Social Justice",
                "CENTRAL", "SC",
                "Post-matric scholarship for SC students to pursue higher education.",
                "ANY", 40.0, 250000.0, "ANY", "",
                "₹1,200 – ₹3,000/month", "31 October 2025",
                "https://scholarships.gov.in",
                "Aadhaar,Income Certificate,Caste Certificate,Marksheet,Bank Passbook"),

            scholarship("NSP - Post Matric Scholarship (ST Students)",
                "National Scholarship Portal / Ministry of Tribal Affairs",
                "CENTRAL", "ST",
                "Post-matric scholarship for ST students for higher education expenses.",
                "ANY", 40.0, 250000.0, "ANY", "",
                "₹1,200 – ₹3,800/month", "31 October 2025",
                "https://scholarships.gov.in",
                "Aadhaar,Income Certificate,Caste Certificate,Marksheet,Bank Passbook"),

            scholarship("NSP - Post Matric Scholarship (OBC Students)",
                "National Scholarship Portal / Ministry of Social Justice",
                "CENTRAL", "OBC",
                "Financial assistance for OBC students pursuing post-matric education.",
                "ANY", 40.0, 100000.0, "ANY", "",
                "₹600 – ₹1,200/month", "31 October 2025",
                "https://scholarships.gov.in",
                "Aadhaar,Income Certificate,OBC Certificate,Marksheet,Bank Passbook"),

            scholarship("Central Sector Scheme of Scholarships (CSSS)",
                "Ministry of Education",
                "CENTRAL", "ALL",
                "Merit-based scholarship for college and university students who scored in top 20 percentile in Class 12.",
                "UG", 80.0, 800000.0, "ANY", "",
                "₹10,000/year (UG), ₹20,000/year (PG)", "31 October 2025",
                "https://scholarships.gov.in",
                "Class 12 Marksheet,Aadhaar,Income Certificate,Bank Passbook"),

            scholarship("Prime Minister's Scholarship Scheme (PMSS)",
                "Ministry of Home Affairs",
                "CENTRAL", "ALL",
                "Scholarship for wards of ex-servicemen and ex-coast guard personnel.",
                "UG", 60.0, 0.0, "ANY", "",
                "₹2,500/month (Boys), ₹3,000/month (Girls)", "31 October 2025",
                "https://ksb.gov.in/pmss.htm",
                "Ex-Serviceman Certificate,Aadhaar,Marksheet,Bank Passbook"),

            scholarship("Begum Hazrat Mahal National Scholarship",
                "Maulana Azad Education Foundation",
                "CENTRAL", "MINORITY",
                "Scholarship for meritorious girls belonging to minority communities (Muslim, Christian, Sikh, Buddhist, Zoroastrian, Jain).",
                "ANY", 50.0, 200000.0, "FEMALE", "",
                "₹5,000 – ₹6,000/year", "30 September 2025",
                "https://maef.nic.in",
                "Aadhaar,Minority Certificate,Income Certificate,Marksheet,Bank Passbook"),

            scholarship("Maulana Azad National Fellowship",
                "Ministry of Minority Affairs",
                "CENTRAL", "MINORITY",
                "Fellowship for minority students pursuing M.Phil and Ph.D.",
                "PG", 55.0, 600000.0, "ANY", "",
                "₹25,000 – ₹28,000/month", "30 November 2025",
                "https://maef.nic.in",
                "Aadhaar,Minority Certificate,Income Certificate,PG Marksheet,Bank Passbook"),

            scholarship("Ishan Uday - Special Scholarship for NE Region",
                "University Grants Commission (UGC)",
                "CENTRAL", "ALL",
                "Scholarship for students from North East region pursuing general degree courses.",
                "UG", 60.0, 600000.0, "ANY", "North East",
                "₹5,400 – ₹7,800/month", "31 October 2025",
                "https://scholarships.gov.in",
                "Aadhaar,Domicile Certificate,Income Certificate,Class 12 Marksheet,Bank Passbook"),

            scholarship("Pragati Scholarship for Girls (AICTE)",
                "All India Council for Technical Education",
                "CENTRAL", "ALL",
                "Scholarship for girl students pursuing technical education (degree/diploma).",
                "UG", 60.0, 800000.0, "FEMALE", "",
                "₹50,000/year + ₹2,000/month contingency", "30 November 2025",
                "https://www.aicte-india.org/bureaus/pgd",
                "Aadhaar,Income Certificate,Admission Letter,Marksheet,Bank Passbook"),

            scholarship("Saksham Scholarship for Differently Abled (AICTE)",
                "All India Council for Technical Education",
                "CENTRAL", "DISABLED",
                "Scholarship for differently-abled students pursuing technical education.",
                "UG", 60.0, 800000.0, "ANY", "",
                "₹50,000/year + ₹2,000/month contingency", "30 November 2025",
                "https://www.aicte-india.org/bureaus/pgd",
                "Aadhaar,Disability Certificate,Income Certificate,Marksheet,Bank Passbook"),

            scholarship("Kishore Vaigyanik Protsahan Yojana (KVPY)",
                "Indian Institute of Science (IISc)",
                "CENTRAL", "ALL",
                "Fellowship for students interested in research careers in science.",
                "UG", 75.0, 0.0, "ANY", "",
                "₹5,000 – ₹7,000/month + annual contingency", "30 November 2025",
                "https://kvpy.iisc.ac.in",
                "Aadhaar,Class 12 Marksheet,Bank Passbook"),

            scholarship("Tata Capital Pankh Scholarship",
                "Tata Capital",
                "PRIVATE", "ALL",
                "Scholarship for meritorious students from economically weaker sections pursuing UG/Diploma.",
                "UG", 60.0, 400000.0, "ANY", "",
                "Up to ₹50,000/year", "31 August 2025",
                "https://www.tatacapital.com/about-us/csr/pankh-scholarship.html",
                "Aadhaar,Income Certificate,Marksheet,Admission Letter,Bank Passbook"),

            scholarship("Reliance Foundation Undergraduate Scholarship",
                "Reliance Foundation",
                "PRIVATE", "ALL",
                "Scholarship for undergraduate students in STEM and humanities.",
                "UG", 60.0, 250000.0, "ANY", "",
                "₹2,00,000 over 4 years", "31 December 2025",
                "https://scholarships.reliancefoundation.org",
                "Aadhaar,Income Certificate,Class 12 Marksheet,Admission Letter,Bank Passbook"),

            scholarship("Buddy4Study - L'Oréal India For Young Women in Science",
                "L'Oréal India",
                "PRIVATE", "ALL",
                "Scholarship for young women pursuing science at undergraduate level.",
                "UG", 60.0, 400000.0, "FEMALE", "",
                "₹2,50,000 total", "28 February 2026",
                "https://www.buddy4study.com",
                "Aadhaar,Income Certificate,Marksheet,Admission Letter,Bank Passbook"),

            scholarship("Vidyasaarathi Scholarship",
                "NSDL e-Governance Infrastructure",
                "PRIVATE", "ALL",
                "Multiple scholarships from various corporates for ITI, Diploma, UG students.",
                "UG", 50.0, 600000.0, "ANY", "",
                "₹10,000 – ₹1,00,000/year", "Varies",
                "https://www.vidyasaarathi.co.in",
                "Aadhaar,Income Certificate,Marksheet,Admission Letter,Bank Passbook"),

            scholarship("Maharashtra State Government Scholarship (EBC)",
                "Government of Maharashtra",
                "STATE", "EWS",
                "Scholarship for economically backward class students in Maharashtra.",
                "ANY", 50.0, 100000.0, "ANY", "Maharashtra",
                "₹2,000 – ₹5,000/year", "31 October 2025",
                "https://mahadbt.maharashtra.gov.in",
                "Aadhaar,Income Certificate,Domicile Certificate,Marksheet,Bank Passbook"),

            scholarship("Swami Vivekananda Merit-cum-Means Scholarship (West Bengal)",
                "Government of West Bengal",
                "STATE", "ALL",
                "Merit-cum-means scholarship for students in West Bengal.",
                "UG", 75.0, 250000.0, "ANY", "West Bengal",
                "₹1,000 – ₹5,000/month", "31 October 2025",
                "https://svmcm.wbhed.gov.in",
                "Aadhaar,Income Certificate,Domicile Certificate,Class 12 Marksheet,Bank Passbook"),

            scholarship("Dr. Ambedkar Post Matric Scholarship (Karnataka)",
                "Government of Karnataka",
                "STATE", "SC",
                "Post-matric scholarship for SC students domiciled in Karnataka.",
                "ANY", 40.0, 250000.0, "ANY", "Karnataka",
                "₹1,500 – ₹3,500/month", "31 October 2025",
                "https://sw.kar.nic.in",
                "Aadhaar,Caste Certificate,Income Certificate,Domicile Certificate,Marksheet,Bank Passbook"),

            scholarship("UP Scholarship (Post Matric)",
                "Government of Uttar Pradesh",
                "STATE", "ALL",
                "Post-matric scholarship for SC/ST/OBC/General students in Uttar Pradesh.",
                "ANY", 40.0, 200000.0, "ANY", "Uttar Pradesh",
                "₹2,000 – ₹5,000/year", "31 October 2025",
                "https://scholarship.up.gov.in",
                "Aadhaar,Income Certificate,Caste Certificate,Domicile Certificate,Marksheet,Bank Passbook"),

            scholarship("Inspire Scholarship (DST)",
                "Department of Science & Technology",
                "CENTRAL", "ALL",
                "Scholarship for students pursuing natural and basic sciences at UG and PG level.",
                "UG", 80.0, 0.0, "ANY", "",
                "₹80,000/year", "31 December 2025",
                "https://online-inspire.gov.in",
                "Aadhaar,Class 12 Marksheet,Admission Letter,Bank Passbook")
        ));
    }

    private Scholarship scholarship(String name, String provider, String category, String targetGroup,
                                     String description, String degree, Double minMarks, Double maxIncome,
                                     String gender, String state, String amount, String deadline,
                                     String applyUrl, String docs) {
        Scholarship s = new Scholarship();
        s.setName(name);
        s.setProvider(provider);
        s.setCategory(category);
        s.setTargetGroup(targetGroup);
        s.setDescription(description);
        s.setEligibilityDegree(degree);
        s.setMinMarksPercent(minMarks);
        s.setMaxAnnualIncome(maxIncome);
        s.setGenderRequired(gender);
        s.setStateSpecific(state);
        s.setAmount(amount);
        s.setDeadline(deadline);
        s.setApplyUrl(applyUrl);
        s.setRequiredDocuments(docs);
        return s;
    }
}
