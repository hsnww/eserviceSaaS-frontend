export interface Feature {
    id: number;
    name: string;
}

export interface Plan {
    id: number;
    name: string;
    price: string;
    employee_limit: string;
    features: Feature[];
}

export async function fetchPlans(): Promise<Plan[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/plans`);

    if (!res.ok) {
        throw new Error("Failed to fetch plans");
    }

    return res.json();
}
