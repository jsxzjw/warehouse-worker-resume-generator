export interface ResumeExample {
  id: number;
  title: string;
  slug: string;
  experience: string;
  description: string;
  fullDescription: string;
  tags: string[];
  color: string;
  skills: string[];
  responsibilities: string[];
  achievements: string[];
}

export const resumeExamples: ResumeExample[] = [
  {
    id: 1,
    title: "Forklift Operator",
    slug: "forklift-operator",
    experience: "5+ Years",
    description: "Experienced forklift operator with expertise in inventory management and safety compliance.",
    fullDescription: "Professional forklift operator with 5+ years of experience in warehouse operations, inventory management, and safety compliance. Skilled in operating various forklift types and maintaining 100% safety record.",
    tags: ["Forklift", "Inventory", "Safety"],
    color: "from-blue-500 to-blue-600",
    skills: [
      "Forklift Operation (Stand-up, Sit-down, Reach)",
      "Inventory Management Systems",
      "Safety Protocols & OSHA Compliance",
      "Shipping & Receiving",
      "Quality Control",
      "Team Leadership"
    ],
    responsibilities: [
      "Operate forklifts to move materials throughout warehouse",
      "Load and unload shipments from delivery trucks",
      "Maintain accurate inventory records",
      "Conduct safety inspections before each shift",
      "Train new forklift operators on safety procedures"
    ],
    achievements: [
      "Maintained 100% safety record throughout 5-year career",
      "Reduced inventory discrepancies by 40% through improved tracking",
      "Trained 15+ new forklift operators",
      "Achieved 99% on-time delivery rate"
    ]
  },
  {
    id: 2,
    title: "Warehouse Associate",
    slug: "warehouse-associate",
    experience: "3+ Years",
    description: "Dedicated warehouse associate skilled in order fulfillment, shipping/receiving, and team collaboration.",
    fullDescription: "Reliable warehouse associate with 3+ years of experience in fast-paced distribution centers. Expert in order fulfillment, inventory management, and maintaining high accuracy levels.",
    tags: ["Order Fulfillment", "Shipping", "Team Player"],
    color: "from-emerald-500 to-emerald-600",
    skills: [
      "Order Picking & Packing",
      "Shipping & Receiving",
      "Inventory Management",
      "RF Scanner Operation",
      "Quality Assurance",
      "Team Collaboration"
    ],
    responsibilities: [
      "Pick and pack orders accurately and efficiently",
      "Receive and process incoming shipments",
      "Operate RF scanners to track inventory",
      "Maintain clean and organized workspace",
      "Collaborate with team to meet daily targets"
    ],
    achievements: [
      "Maintained 99.8% order accuracy rate",
      "Consistently exceeded daily pick targets by 20%",
      "Employee of the Month 3 times",
      "Zero safety incidents in 3 years"
    ]
  },
  {
    id: 3,
    title: "Shipping & Receiving Clerk",
    slug: "shipping-receiving-clerk",
    experience: "4+ Years",
    description: "Detail-oriented shipping and receiving clerk with expertise in logistics coordination and quality control.",
    fullDescription: "Detail-oriented shipping and receiving clerk with 4+ years of experience managing inbound and outbound shipments. Expert in logistics coordination, documentation, and quality control.",
    tags: ["Logistics", "Quality Control", "Documentation"],
    color: "from-purple-500 to-purple-600",
    skills: [
      "Shipping & Receiving Operations",
      "Logistics Coordination",
      "Inventory Control",
      "Documentation & Record Keeping",
      "Quality Inspection",
      "Carrier Coordination"
    ],
    responsibilities: [
      "Process incoming and outgoing shipments",
      "Verify shipment accuracy against packing slips",
      "Maintain shipping records and documentation",
      "Coordinate with carriers for pickup and delivery",
      "Conduct quality inspections on received goods"
    ],
    achievements: [
      "Reduced shipping errors by 35%",
      "Processed 500+ shipments monthly with 99% accuracy",
      "Implemented new tracking system improving efficiency by 25%",
      "Maintained 99.5% on-time delivery rate"
    ]
  },
  {
    id: 4,
    title: "Warehouse Manager",
    slug: "warehouse-manager",
    experience: "8+ Years",
    description: "Results-driven warehouse manager with proven track record in process optimization and team leadership.",
    fullDescription: "Results-driven warehouse manager with 8+ years of experience leading warehouse operations and teams. Proven track record in process optimization, team leadership, and achieving operational excellence.",
    tags: ["Management", "Leadership", "Process Improvement"],
    color: "from-orange-500 to-orange-600",
    skills: [
      "Warehouse Operations Management",
      "Team Leadership & Development",
      "Process Optimization",
      "Inventory Control",
      "Budget Management",
      "Strategic Planning"
    ],
    responsibilities: [
      "Oversee daily warehouse operations and team of 25+ employees",
      "Develop and implement operational processes and procedures",
      "Manage inventory levels and coordinate with procurement",
      "Train and mentor warehouse staff",
      "Monitor performance metrics and implement improvements"
    ],
    achievements: [
      "Reduced operational costs by 30% through process improvements",
      "Increased team productivity by 40%",
      "Maintained 99.9% inventory accuracy",
      "Led team to achieve Warehouse of the Year award"
    ]
  },
  {
    id: 5,
    title: "Material Handler",
    slug: "material-handler",
    experience: "2+ Years",
    description: "Efficient material handler skilled in inventory management and equipment operation.",
    fullDescription: "Efficient material handler with 2+ years of experience in warehouse environments. Skilled in material movement, equipment operation, and maintaining organized inventory systems.",
    tags: ["Materials", "Equipment", "Organization"],
    color: "from-indigo-500 to-indigo-600",
    skills: [
      "Material Handling Equipment",
      "Inventory Organization",
      "Pallet Jack & Hand Truck Operation",
      "Stock Rotation",
      "Safety Compliance",
      "Order Selection"
    ],
    responsibilities: [
      "Move materials throughout warehouse using various equipment",
      "Organize stock and maintain proper rotation",
      "Operate pallet jacks and hand trucks safely",
      "Assist with inventory counts and stock checks",
      "Maintain clean and safe work areas"
    ],
    achievements: [
      "Maintained zero safety incidents",
      "Consistently met daily production targets",
      "Cross-trained in 3 different warehouse areas",
      "Promoted to team lead within 18 months"
    ]
  },
  {
    id: 6,
    title: "Order Picker",
    slug: "order-picker",
    experience: "3+ Years",
    description: "Accurate order picker with exceptional attention to detail and productivity metrics.",
    fullDescription: "Accurate and efficient order picker with 3+ years of experience in high-volume distribution centers. Exceptional attention to detail and proven track record of meeting productivity targets.",
    tags: ["Order Picking", "Accuracy", "Productivity"],
    color: "from-rose-500 to-rose-600",
    skills: [
      "Order Picking & Packing",
      "RF Scanner Operation",
      "Inventory Management",
      "Quality Control",
      "Speed & Accuracy",
      "Safety Protocols"
    ],
    responsibilities: [
      "Pick orders quickly and accurately using pick lists",
      "Operate RF scanners to track inventory and orders",
      "Pack products securely for shipment",
      "Maintain accurate order records",
      "Follow all safety procedures and guidelines"
    ],
    achievements: [
      "Maintained 99.9% pick accuracy rate",
      "Consistently exceeded daily pick rate targets by 30%",
      "Picked over 200 orders daily with zero errors",
      "Employee of the Quarter for exceptional accuracy"
    ]
  }
];

// Helper functions
export function getExampleBySlug(slug: string): ResumeExample | undefined {
  return resumeExamples.find(example => example.slug === slug);
}

export function getExampleById(id: number): ResumeExample | undefined {
  return resumeExamples.find(example => example.id === id);
}
