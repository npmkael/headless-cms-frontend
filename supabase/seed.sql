INSERT INTO users (email, password_hash, role) VALUES
('admin@example.com', '$2b$10$rKvGm5Y7YhL5P6cGxKvY3eJXn8qGxKY8F.hD8pKQz0y5yN6wL7.Yq', 'admin');

INSERT INTO services (title, description, icon_url, sort_order, is_active) VALUES
(
    'Web Development',
    'Custom website development using modern technologies like React, Next.js, and Node.js. We build fast, scalable, and SEO-friendly websites tailored to your business needs.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-services-imgs/service-1.png',
    1,
    true
),
(
    'Mobile App Development',
    'Native and cross-platform mobile applications for iOS and Android. We create intuitive, high-performance apps that engage your users and drive business growth.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-services-imgs/service-2.png',
    2,
    true
),
(
    'UI/UX Design',
    'User-centered design that combines aesthetics with functionality. We create beautiful, intuitive interfaces that provide exceptional user experiences across all devices.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-services-imgs/service-3.png',
    3,
    true
),
(
    'Digital Marketing',
    'Comprehensive digital marketing strategies including SEO, content marketing, social media management, and paid advertising to help your business reach and engage your target audience.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-services-imgs/service-4.png',
    4,
    true
);

INSERT INTO case_studies (title, short_description, cover_image_url, link_url, sort_order, is_active) VALUES
(
    'FinTech Mobile Banking App',
    'A comprehensive mobile banking solution with biometric authentication, real-time transactions, and AI-powered financial insights. Serving over 500,000 active users with 99.9% uptime.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-case-studies-imgs/case-study.png',
    '/case-studies/fintech-banking-app',
    1,
    true
),
(
    'E-Learning Platform Redesign',
    'Complete UX overhaul of an online learning platform, resulting in 45% increase in course completion rates and 60% improvement in user engagement. Modern, accessible interface serving 100K+ students.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-case-studies-imgs/case-study.png',
    '/case-studies/elearning-platform',
    2,
    true
),
(
    'Healthcare Management System',
    'HIPAA-compliant healthcare management system connecting patients, doctors, and administrators. Features include appointment scheduling, telemedicine, and electronic health records.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-case-studies-imgs/case-study.png',
    '/case-studies/healthcare-system',
    3,
    true
),
(
    'Food Delivery Marketplace',
    'Real-time food delivery platform connecting restaurants, delivery drivers, and customers. Handles 10,000+ daily orders with integrated payment processing and GPS tracking.',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-case-studies-imgs/case-study.png',
    '/case-studies/food-delivery',
    4,
    true
);

INSERT INTO working_processes (step_no, title, description, sort_order, is_active) VALUES
(
    1,
    'Discovery & Planning',
    'We start by understanding your business goals, target audience, and project requirements. Through workshops and research, we create a comprehensive project roadmap and technical specification.',
    1,
    true
),
(
    2,
    'Design & Prototyping',
    'Our design team creates wireframes, mockups, and interactive prototypes. We focus on user experience, brand consistency, and modern design principles to ensure your product stands out.',
    2,
    true
),
(
    3,
    'Development & Testing',
    'Our developers bring designs to life using cutting-edge technologies and best practices. We follow agile methodology with continuous testing to ensure quality, performance, and security.',
    3,
    true
),
(
    4,
    'Launch & Support',
    'We handle deployment, monitoring, and provide ongoing maintenance and support. Our team ensures smooth launch and continues to optimize performance based on real-world usage and feedback.',
    4,
    true
);

INSERT INTO team_members (name, role, avatar_url, socials_json, sort_order, is_active) VALUES
(
    'Sarah Johnson',
    'Chief Executive Officer',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-team-members-imgs/team-1.jpg',
    '{
        "linkedin": "https://linkedin.com/in/sarahjohnson",
        "twitter": "https://twitter.com/sarahjohnson",
        "github": "https://github.com/sarahjohnson"
    }'::jsonb,
    1,
    true
),
(
    'Michael Chen',
    'Chief Technology Officer',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-team-members-imgs/team-2.jpg',
    '{
        "linkedin": "https://linkedin.com/in/michaelchen",
        "twitter": "https://twitter.com/michaelchen",
        "github": "https://github.com/michaelchen"
    }'::jsonb,
    2,
    true
),
(
    'Emily Rodriguez',
    'Lead Designer',
    'https://nxdeiqgftcvenxpccynj.supabase.co/storage/v1/object/public/cms-team-members-imgs/team-3.jpg',
    '{
        "linkedin": "https://linkedin.com/in/emilyrodriguez",
        "twitter": "https://twitter.com/emilyrodriguez",
        "dribbble": "https://dribbble.com/emilyrodriguez"
    }'::jsonb,
    3,
    true
);

INSERT INTO testimonials (name, role_company, message, avatar_url, rating, sort_order, is_active) VALUES
(
    'Robert Anderson',
    'CEO at TechStart Inc',
    'Working with this team was an absolute pleasure. They delivered our mobile app ahead of schedule and exceeded all our expectations. The attention to detail and commitment to quality is unmatched.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    5,
    1,
    true
),
(
    'Lisa Thompson',
    'Marketing Director at GrowthHub',
    'The website redesign transformed our online presence completely. We saw a 150% increase in conversions within the first month. Their strategic approach and technical expertise made all the difference.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    5,
    2,
    true
),
(
    'James Martinez',
    'Founder at HealthTech Solutions',
    'From discovery to launch, the entire process was seamless. They understood our complex healthcare requirements and built a HIPAA-compliant system that our staff and patients love using.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    5,
    3,
    true
),
(
    'Amanda Lee',
    'VP of Operations at RetailPro',
    'The e-commerce platform they built handles thousands of daily transactions flawlessly. Their ongoing support and optimization have been crucial to our continued growth and success.',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop',
    5,
    4,
    true
);

INSERT INTO contact_submissions (name, email, message, status) VALUES
(
    'John Smith',
    'john.smith@email.com',
    'I am interested in learning more about your web development services. We are looking to rebuild our company website with modern technologies. Could we schedule a consultation call?',
    'new'
),
(
    'Maria Garcia',
    'maria.garcia@company.com',
    'We need a mobile app for our restaurant chain. The app should have online ordering, loyalty program, and push notifications. What is your estimated timeline and cost?',
    'new'
),
(
    'Tom Wilson',
    'tom.wilson@startup.io',
    'Looking for a development partner for our SaaS product. We need full-stack developers with experience in React and Node.js. Do you have availability for a 6-month project?',
    'read'
),
(
    'Rachel Brown',
    'rachel.brown@enterprise.com',
    'Interested in discussing a large-scale enterprise project. We need to migrate our legacy system to a modern cloud-based architecture. Can you provide case studies of similar projects?',
    'read'
),
(
    'Alex Turner',
    'alex.turner@gmail.com',
    'Your portfolio is impressive! I would like to know more about your UI/UX design process and pricing for a complete brand identity and website design.',
    'archived'
);
