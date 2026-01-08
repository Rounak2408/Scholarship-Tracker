export interface ScholarshipPortal {
  id: string
  name: string
  type: "Central" | "State" | "Private"
  coveredSchemes: string
  description: string
  portalUrl: string
  applicableStates?: string[]
  eligibility: string
}

export const scholarshipPortals: ScholarshipPortal[] = [
  {
    id: "nsp",
    name: "National Scholarship Portal (NSP)",
    type: "Central",
    coveredSchemes: "Central Government Scholarships including Post Matric, Pre-Matric, Merit-cum-Means",
    description: "Official portal for all central government scholarship schemes",
    portalUrl: "https://scholarships.gov.in",
    eligibility: "Various - Income, merit, and category-based",
    applicableStates: ["ALL"],
  },
  {
    id: "bsp",
    name: "Bihar Scholarship Portal",
    type: "State",
    coveredSchemes: "Post Matric, Pre-Matric, Mukhyamantri Scholarship Yojana",
    description: "Official Bihar government scholarship programs",
    portalUrl: "https://scholarship.bih.nic.in",
    eligibility: "Bihar residents with merit requirements",
    applicableStates: ["Bihar"],
  },
  {
    id: "upsp",
    name: "Uttar Pradesh Scholarship Portal",
    type: "State",
    coveredSchemes: "Post Matric Scholarship, Pre-Matric Scholarship, Integrated Scholarship Scheme",
    description: "Official UP government scholarship schemes",
    portalUrl: "https://scholarship.up.gov.in",
    eligibility: "UP residents based on income and merit",
    applicableStates: ["Uttar Pradesh"],
  },
  {
    id: "minority",
    name: "Ministry of Minority Affairs Scholarships",
    type: "Central",
    coveredSchemes: "Merit-cum-Means, Free Coaching, Pre-Matric & Post-Matric",
    description: "Scholarships for minority community students",
    portalUrl: "https://www.scholarships.gov.in",
    eligibility: "Minority communities with merit requirements",
    applicableStates: ["ALL"],
  },
  {
    id: "aicte",
    name: "AICTE Portal",
    type: "Central",
    coveredSchemes: "AICTE Scholarships, Internship Programs, Skill Development",
    description: "Technical education scholarships and grants",
    portalUrl: "https://aicte-india.org",
    eligibility: "Students in technical and engineering courses",
    applicableStates: ["ALL"],
  },
  {
    id: "ugc",
    name: "UGC (University Grants Commission) Scholarships",
    type: "Central",
    coveredSchemes: "UGC-CSIR, INSPIRE, Junior Research Fellowship",
    description: "Research and higher education scholarships",
    portalUrl: "https://ugc.ac.in",
    eligibility: "Higher education and research scholars",
    applicableStates: ["ALL"],
  },
  {
    id: "tamilnadu",
    name: "Tamil Nadu Scholarship Portal",
    type: "State",
    coveredSchemes: "State Merit Scholarships, Post-Matric, Pre-Matric",
    description: "Tamil Nadu government scholarship schemes",
    portalUrl: "https://www.tnscholarships.gov.in",
    eligibility: "Tamil Nadu residents",
    applicableStates: ["Tamil Nadu"],
  },
  {
    id: "maharashtra",
    name: "Maharashtra Scholarship Portal",
    type: "State",
    coveredSchemes: "State Scholarships, Mukhyamantri Scholarships, SC/ST Scholarships",
    description: "Maharashtra government scholarship programs",
    portalUrl: "https://scholarships.maharashtra.gov.in",
    eligibility: "Maharashtra residents",
    applicableStates: ["Maharashtra"],
  },
  {
    id: "icmr",
    name: "ICMR Scholarships",
    type: "Central",
    coveredSchemes: "Medical Research, Fellowships, Grants",
    description: "Medical research scholarships and grants",
    portalUrl: "https://icmr.gov.in",
    eligibility: "Medical and health research scholars",
    applicableStates: ["ALL"],
  },
  {
    id: "dsir",
    name: "DSIR Innovation Grants",
    type: "Central",
    coveredSchemes: "Innovation, Research, SEED Grants",
    description: "Department of Scientific and Industrial Research grants",
    portalUrl: "https://www.dsir.gov.in",
    eligibility: "Innovators and researchers",
    applicableStates: ["ALL"],
  },
]

export function getPortalsByType(type: ScholarshipPortal["type"]) {
  return scholarshipPortals.filter((portal) => portal.type === type)
}

export function getPortalsByState(state: string) {
  return scholarshipPortals.filter(
    (portal) => portal.applicableStates?.includes(state) || portal.applicableStates?.includes("ALL"),
  )
}
