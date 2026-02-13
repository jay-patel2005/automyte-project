"use client";

const stats = [
    { target: "50+", label: "Global Projects" },
    { target: "25+", label: "Enterprise Clients" },
    { target: "99%", label: "Accuracy Rate" },
    { target: "24/7", label: "Monitoring" }
];

const Stats = () => {
    return (
        <section className="py-24 px-6 reveal py-32">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-6xl font-bold text-brand-accent mb-2">{stat.target}</div>
                            <p className="text-slate-400 uppercase text-xs tracking-widest font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
