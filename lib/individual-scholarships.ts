export interface IndividualScholarship {
  id: string
  name: string
  type: "Central" | "State" | "Private"
  description: string
  portalUrl: string
  state?: string
  category: string
}

export const individualScholarships: IndividualScholarship[] = [
  // Central Government Schemes
  {
    id: "post-matric",
    name: "Post Matric Scholarship Scheme",
    type: "Central",
    description: "Financial assistance for SC/ST/OBC students pursuing post-matriculation courses",
    portalUrl: "https://scholarships.gov.in",
    category: "Education",
  },
  {
    id: "pre-matric",
    name: "Pre-Matric Scholarship Scheme",
    type: "Central",
    description: "Scholarship for SC/ST students studying in classes 9th and 10th",
    portalUrl: "https://scholarships.gov.in",
    category: "Education",
  },
  {
    id: "merit-means",
    name: "Merit-cum-Means Scholarship",
    type: "Central",
    description: "For economically weaker students with good academic performance",
    portalUrl: "https://scholarships.gov.in",
    category: "Merit",
  },
  {
    id: "minority-merit",
    name: "Ministry of Minority Affairs Merit Scholarship",
    type: "Central",
    description: "Merit-based scholarship for minority community students",
    portalUrl: "https://www.scholarships.gov.in",
    category: "Merit",
  },
  {
    id: "ugc-csir",
    name: "UGC-CSIR NET Fellowship",
    type: "Central",
    description: "Junior Research Fellowship for research scholars",
    portalUrl: "https://ugc.ac.in",
    category: "Research",
  },
  {
    id: "inspire",
    name: "INSPIRE Scholarship",
    type: "Central",
    description: "Innovation in Science Pursuit for Inspired Research",
    portalUrl: "https://www.inspire-dst.gov.in",
    category: "Research",
  },
  
  // State Government Schemes
  {
    id: "cm-bicycle-bihar",
    name: "Chief Minister's Bicycle Scheme (Bihar)",
    type: "State",
    description: "Free bicycle distribution scheme for girl students in Bihar",
    portalUrl: "https://scholarship.bih.nic.in",
    state: "Bihar",
    category: "Welfare",
  },
  {
    id: "mukhyamantri-bihar",
    name: "Mukhyamantri Balika Protsahan Yojana",
    type: "State",
    description: "Bihar government scheme for girl child education",
    portalUrl: "https://scholarship.bih.nic.in",
    state: "Bihar",
    category: "Education",
  },
  {
    id: "up-post-matric",
    name: "UP Post Matric Scholarship",
    type: "State",
    description: "Uttar Pradesh state scholarship for post-matric students",
    portalUrl: "https://scholarship.up.gov.in",
    state: "Uttar Pradesh",
    category: "Education",
  },
  {
    id: "tn-merit",
    name: "Tamil Nadu State Merit Scholarship",
    type: "State",
    description: "Merit scholarship for Tamil Nadu students",
    portalUrl: "https://www.tnscholarships.gov.in",
    state: "Tamil Nadu",
    category: "Merit",
  },
  {
    id: "maha-mukhyamantri",
    name: "Mukhyamantri Yuva Swavlamban Yojana",
    type: "State",
    description: "Maharashtra government scholarship for higher education",
    portalUrl: "https://scholarships.maharashtra.gov.in",
    state: "Maharashtra",
    category: "Education",
  },
  {
    id: "rajasthan-scholarship",
    name: "Rajasthan State Scholarship",
    type: "State",
    description: "Various scholarship schemes for Rajasthan students",
    portalUrl: "https://rajeduboard.rajasthan.gov.in",
    state: "Rajasthan",
    category: "Education",
  },
  {
    id: "kerala-scholarship",
    name: "Kerala State Scholarship",
    type: "State",
    description: "State government scholarships for Kerala students",
    portalUrl: "https://keralascholarship.gov.in",
    state: "Kerala",
    category: "Education",
  },
  {
    id: "west-bengal-scholarship",
    name: "West Bengal State Scholarship",
    type: "State",
    description: "Scholarship programs for West Bengal students",
    portalUrl: "https://wb.gov.in",
    state: "West Bengal",
    category: "Education",
  },
  
  // Private Scholarships
  {
    id: "tata-scholarship",
    name: "Tata Trusts Scholarship",
    type: "Private",
    description: "Merit-based scholarships by Tata Trusts for higher education",
    portalUrl: "https://www.tatatrusts.org",
    category: "Merit",
  },
  {
    id: "reliance-foundation",
    name: "Reliance Foundation Scholarship",
    type: "Private",
    description: "Scholarships for meritorious students from economically weaker sections",
    portalUrl: "https://www.reliancefoundation.org",
    category: "Merit",
  },
  {
    id: "aditya-birla",
    name: "Aditya Birla Scholarship",
    type: "Private",
    description: "Scholarship program for meritorious students",
    portalUrl: "https://www.adityabirlascholarship.net",
    category: "Merit",
  },
  {
    id: "infosys-foundation",
    name: "Infosys Foundation Scholarship",
    type: "Private",
    description: "Scholarships for engineering and technology students",
    portalUrl: "https://www.infosys.com",
    category: "Education",
  },
  {
    id: "wipro-foundation",
    name: "Wipro Foundation Scholarship",
    type: "Private",
    description: "Educational scholarships for underprivileged students",
    portalUrl: "https://www.wiprofoundation.org",
    category: "Education",
  },
  {
    id: "icici-foundation",
    name: "ICICI Foundation Scholarship",
    type: "Private",
    description: "Scholarships for higher education and skill development",
    portalUrl: "https://www.icicifoundation.org",
    category: "Education",
  },
  {
    id: "hdfc-bank-scholarship",
    name: "HDFC Bank Parivartan Scholarship",
    type: "Private",
    description: "Merit-cum-means scholarship for higher education",
    portalUrl: "https://www.hdfcbank.com",
    category: "Merit",
  },
  {
    id: "axis-bank-foundation",
    name: "Axis Bank Foundation Scholarship",
    type: "Private",
    description: "Educational support for deserving students",
    portalUrl: "https://www.axisbankfoundation.org",
    category: "Education",
  },
]

