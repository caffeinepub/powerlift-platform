import { create } from "zustand";

export type Role = "player" | "organizer" | "admin";

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  orgName?: string;
  approved: boolean;
  createdAt: string;
}

export interface Competition {
  id: string;
  name: string;
  state: string;
  city: string;
  area: string;
  date: string;
  entryFee: number;
  weightCategories: string[];
  description: string;
  contactNumber: string;
  organizerId: string;
  organizerName: string;
  featured: boolean;
  active: boolean;
  participants: string[];
  gradientIndex: number;
}

export interface Review {
  id: string;
  competitionId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const SEED_USERS: User[] = [
  {
    id: "u1",
    role: "admin",
    name: "Super Admin",
    phone: "0000000000",
    approved: true,
    createdAt: "2026-01-01",
  },
  {
    id: "u2",
    role: "organizer",
    name: "Raj Sharma",
    phone: "1111111111",
    orgName: "Iron Beast Federation",
    approved: true,
    createdAt: "2026-01-05",
  },
  {
    id: "u3",
    role: "organizer",
    name: "Priya Singh",
    phone: "3333333333",
    orgName: "Delhi Strength Club",
    approved: false,
    createdAt: "2026-03-10",
  },
  {
    id: "u4",
    role: "player",
    name: "Arjun Patel",
    phone: "2222222222",
    approved: true,
    createdAt: "2026-01-10",
  },
  {
    id: "u5",
    role: "player",
    name: "Vikram Rao",
    phone: "4444444444",
    approved: true,
    createdAt: "2026-02-01",
  },
  {
    id: "u6",
    role: "player",
    name: "Sneha Kumar",
    phone: "5555555555",
    approved: true,
    createdAt: "2026-02-15",
  },
];

const SEED_COMPETITIONS: Competition[] = [
  {
    id: "c1",
    name: "Mumbai Open Powerlifting Championship",
    state: "Maharashtra",
    city: "Mumbai",
    area: "Andheri",
    date: "2026-04-15",
    entryFee: 1500,
    weightCategories: [
      "59kg",
      "66kg",
      "74kg",
      "83kg",
      "93kg",
      "105kg",
      "120kg+",
    ],
    description:
      "Premier powerlifting event in Mumbai featuring top athletes from across India. Sanctioned by IPF.",
    contactNumber: "9876543210",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: true,
    active: true,
    participants: ["u4", "u5"],
    gradientIndex: 0,
  },
  {
    id: "c2",
    name: "Delhi Strength Classic",
    state: "Delhi",
    city: "Delhi",
    area: "Connaught Place",
    date: "2026-05-20",
    entryFee: 1200,
    weightCategories: ["66kg", "74kg", "83kg", "93kg", "105kg"],
    description:
      "Annual strength classic in the capital city. Open to all age categories.",
    contactNumber: "9876543211",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: true,
    active: true,
    participants: ["u4"],
    gradientIndex: 1,
  },
  {
    id: "c3",
    name: "Bangalore Barbell Open",
    state: "Karnataka",
    city: "Bangalore",
    area: "Koramangala",
    date: "2026-04-28",
    entryFee: 1000,
    weightCategories: ["59kg", "66kg", "74kg", "83kg"],
    description:
      "The biggest powerlifting meet in South India. All lifters welcome.",
    contactNumber: "9876543212",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: false,
    active: true,
    participants: ["u5", "u6"],
    gradientIndex: 2,
  },
  {
    id: "c4",
    name: "Chennai Iron Games",
    state: "Tamil Nadu",
    city: "Chennai",
    area: "T. Nagar",
    date: "2026-06-10",
    entryFee: 800,
    weightCategories: ["74kg", "83kg", "93kg", "105kg", "120kg+"],
    description:
      "Southern India powerlifting showcase. Raw and equipped divisions.",
    contactNumber: "9876543213",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: false,
    active: true,
    participants: [],
    gradientIndex: 3,
  },
  {
    id: "c5",
    name: "Ahmedabad Power Fest",
    state: "Gujarat",
    city: "Ahmedabad",
    area: "SG Highway",
    date: "2026-07-05",
    entryFee: 900,
    weightCategories: ["59kg", "66kg", "83kg", "93kg"],
    description:
      "Gujarat state level powerlifting competition. Prizes for top 3 in each category.",
    contactNumber: "9876543214",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: false,
    active: true,
    participants: ["u6"],
    gradientIndex: 4,
  },
  {
    id: "c6",
    name: "Jaipur Royal Strength Meet",
    state: "Rajasthan",
    city: "Jaipur",
    area: "Vaishali Nagar",
    date: "2026-05-12",
    entryFee: 700,
    weightCategories: ["66kg", "74kg", "83kg", "93kg", "105kg"],
    description: "Rajasthan state championship. Meet director IPF certified.",
    contactNumber: "9876543215",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: false,
    active: true,
    participants: [],
    gradientIndex: 5,
  },
  {
    id: "c7",
    name: "Pune Powerhouse Classic",
    state: "Maharashtra",
    city: "Pune",
    area: "Baner",
    date: "2026-04-20",
    entryFee: 1100,
    weightCategories: ["59kg", "66kg", "74kg", "83kg", "93kg"],
    description: "Pune premier powerlifting event. Drug tested meet.",
    contactNumber: "9876543216",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: true,
    active: true,
    participants: ["u4", "u5", "u6"],
    gradientIndex: 6,
  },
  {
    id: "c8",
    name: "Hyderabad Hercules Open",
    state: "Telangana",
    city: "Hyderabad",
    area: "Banjara Hills",
    date: "2026-08-18",
    entryFee: 1300,
    weightCategories: ["74kg", "83kg", "93kg", "105kg", "120kg+"],
    description:
      "Open powerlifting meet welcoming lifters from all federations.",
    contactNumber: "9876543217",
    organizerId: "u2",
    organizerName: "Iron Beast Federation",
    featured: false,
    active: true,
    participants: [],
    gradientIndex: 7,
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    competitionId: "c1",
    userId: "u4",
    userName: "Arjun Patel",
    rating: 5,
    comment:
      "Amazing event! Well organized with great equipment. Will definitely compete again.",
    createdAt: "2026-02-01",
  },
  {
    id: "r2",
    competitionId: "c1",
    userId: "u5",
    userName: "Vikram Rao",
    rating: 4,
    comment: "Good meet, professional judges. Venue was excellent.",
    createdAt: "2026-02-02",
  },
  {
    id: "r3",
    competitionId: "c2",
    userId: "u4",
    userName: "Arjun Patel",
    rating: 5,
    comment: "Best powerlifting meet in Delhi. Top notch organization!",
    createdAt: "2026-02-10",
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    userId: "u4",
    message: 'New competition "Mumbai Open" is now available near you!',
    read: false,
    createdAt: "2026-03-28",
  },
  {
    id: "n2",
    userId: "u4",
    message: "Your registration for Pune Powerhouse Classic is confirmed.",
    read: false,
    createdAt: "2026-03-25",
  },
  {
    id: "n3",
    userId: "u2",
    message:
      "Your organizer account has been approved. You can now create competitions.",
    read: true,
    createdAt: "2026-01-06",
  },
  {
    id: "n4",
    userId: "u3",
    message: "Your organizer account is pending admin approval.",
    read: false,
    createdAt: "2026-03-10",
  },
];

function loadFromStorage<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function initSeedData() {
  if (!localStorage.getItem("pl_users"))
    localStorage.setItem("pl_users", JSON.stringify(SEED_USERS));
  if (!localStorage.getItem("pl_competitions"))
    localStorage.setItem("pl_competitions", JSON.stringify(SEED_COMPETITIONS));
  if (!localStorage.getItem("pl_reviews"))
    localStorage.setItem("pl_reviews", JSON.stringify(SEED_REVIEWS));
  if (!localStorage.getItem("pl_notifications"))
    localStorage.setItem(
      "pl_notifications",
      JSON.stringify(SEED_NOTIFICATIONS),
    );
}

interface Store {
  currentUser: User | null;
  users: User[];
  competitions: Competition[];
  reviews: Review[];
  notifications: Notification[];
  currentPage: string;
  editingCompetition: Competition | null;

  navigate: (page: string) => void;
  login: (phone: string) => User | null;
  logout: () => void;
  register: (data: Omit<User, "id" | "approved" | "createdAt">) => User;
  updateProfile: (updates: Partial<User>) => void;

  createCompetition: (
    data: Omit<Competition, "id" | "participants" | "gradientIndex">,
  ) => void;
  updateCompetition: (id: string, data: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  joinCompetition: (id: string) => void;

  addReview: (competitionId: string, rating: number, comment: string) => void;

  markNotificationRead: (id: string) => void;
  addNotification: (userId: string, message: string) => void;

  approveOrganizer: (userId: string) => void;
  rejectOrganizer: (userId: string) => void;
  deleteUser: (userId: string) => void;
  toggleFeatured: (id: string) => void;
  toggleActive: (id: string) => void;

  setEditingCompetition: (c: Competition | null) => void;
  refreshFromStorage: () => void;
}

export const useStore = create<Store>((set, get) => {
  initSeedData();
  const users = loadFromStorage<User>("pl_users", SEED_USERS);
  const competitions = loadFromStorage<Competition>(
    "pl_competitions",
    SEED_COMPETITIONS,
  );
  const reviews = loadFromStorage<Review>("pl_reviews", SEED_REVIEWS);
  const notifications = loadFromStorage<Notification>(
    "pl_notifications",
    SEED_NOTIFICATIONS,
  );
  let currentUser: User | null = null;
  try {
    const raw = localStorage.getItem("pl_current_user");
    if (raw) currentUser = JSON.parse(raw) as User;
  } catch {
    /* empty */
  }

  return {
    currentUser,
    users,
    competitions,
    reviews,
    notifications,
    currentPage: "/",
    editingCompetition: null,

    navigate: (page) => set({ currentPage: page }),

    login: (phone) => {
      const users = loadFromStorage<User>("pl_users", SEED_USERS);
      const user = users.find((u) => u.phone === phone) ?? null;
      if (user) {
        localStorage.setItem("pl_current_user", JSON.stringify(user));
        set({ currentUser: user, users });
      }
      return user;
    },

    logout: () => {
      localStorage.removeItem("pl_current_user");
      set({ currentUser: null, currentPage: "/" });
    },

    register: (data) => {
      const users = loadFromStorage<User>("pl_users", SEED_USERS);
      const newUser: User = {
        ...data,
        id: `u${Date.now()}`,
        approved: data.role !== "organizer",
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [...users, newUser];
      saveToStorage("pl_users", updated);
      if (data.role === "organizer") {
        const notifs = loadFromStorage<Notification>(
          "pl_notifications",
          SEED_NOTIFICATIONS,
        );
        const n: Notification = {
          id: `n${Date.now()}`,
          userId: newUser.id,
          message: "Your organizer account is pending admin approval.",
          read: false,
          createdAt: new Date().toISOString().split("T")[0],
        };
        saveToStorage("pl_notifications", [...notifs, n]);
      }
      set({ users: updated });
      return newUser;
    },

    updateProfile: (updates) => {
      const { currentUser, users } = get();
      if (!currentUser) return;
      const updated = users.map((u) =>
        u.id === currentUser.id ? { ...u, ...updates } : u,
      );
      saveToStorage("pl_users", updated);
      const newCurrent = { ...currentUser, ...updates };
      localStorage.setItem("pl_current_user", JSON.stringify(newCurrent));
      set({ users: updated, currentUser: newCurrent });
    },

    createCompetition: (data) => {
      const comps = loadFromStorage<Competition>(
        "pl_competitions",
        SEED_COMPETITIONS,
      );
      const newComp: Competition = {
        ...data,
        id: `c${Date.now()}`,
        participants: [],
        gradientIndex: Math.floor(Math.random() * 8),
      };
      const updated = [...comps, newComp];
      saveToStorage("pl_competitions", updated);
      set({ competitions: updated });
    },

    updateCompetition: (id, data) => {
      const comps = loadFromStorage<Competition>(
        "pl_competitions",
        SEED_COMPETITIONS,
      );
      const updated = comps.map((c) => (c.id === id ? { ...c, ...data } : c));
      saveToStorage("pl_competitions", updated);
      set({ competitions: updated });
    },

    deleteCompetition: (id) => {
      const comps = loadFromStorage<Competition>(
        "pl_competitions",
        SEED_COMPETITIONS,
      );
      const updated = comps.filter((c) => c.id !== id);
      saveToStorage("pl_competitions", updated);
      set({ competitions: updated });
    },

    joinCompetition: (id) => {
      const { currentUser } = get();
      if (!currentUser) return;
      const comps = loadFromStorage<Competition>(
        "pl_competitions",
        SEED_COMPETITIONS,
      );
      const updated = comps.map((c) =>
        c.id === id && !c.participants.includes(currentUser.id)
          ? { ...c, participants: [...c.participants, currentUser.id] }
          : c,
      );
      saveToStorage("pl_competitions", updated);
      set({ competitions: updated });
    },

    addReview: (competitionId, rating, comment) => {
      const { currentUser } = get();
      if (!currentUser) return;
      const reviews = loadFromStorage<Review>("pl_reviews", SEED_REVIEWS);
      const newReview: Review = {
        id: `r${Date.now()}`,
        competitionId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment,
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [...reviews, newReview];
      saveToStorage("pl_reviews", updated);
      set({ reviews: updated });
    },

    markNotificationRead: (id) => {
      const notifs = loadFromStorage<Notification>(
        "pl_notifications",
        SEED_NOTIFICATIONS,
      );
      const updated = notifs.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      saveToStorage("pl_notifications", updated);
      set({ notifications: updated });
    },

    addNotification: (userId, message) => {
      const notifs = loadFromStorage<Notification>(
        "pl_notifications",
        SEED_NOTIFICATIONS,
      );
      const n: Notification = {
        id: `n${Date.now()}`,
        userId,
        message,
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveToStorage("pl_notifications", [...notifs, n]);
      set({ notifications: [...notifs, n] });
    },

    approveOrganizer: (userId) => {
      const users = loadFromStorage<User>("pl_users", SEED_USERS);
      const updated = users.map((u) =>
        u.id === userId ? { ...u, approved: true } : u,
      );
      saveToStorage("pl_users", updated);
      set({ users: updated });
      get().addNotification(
        userId,
        "Your organizer account has been approved! You can now create competitions.",
      );
    },

    rejectOrganizer: (userId) => {
      const users = loadFromStorage<User>("pl_users", SEED_USERS);
      const updated = users.filter((u) => u.id !== userId);
      saveToStorage("pl_users", updated);
      set({ users: updated });
    },

    deleteUser: (userId) => {
      const users = loadFromStorage<User>("pl_users", SEED_USERS);
      const updated = users.filter((u) => u.id !== userId);
      saveToStorage("pl_users", updated);
      set({ users: updated });
    },

    toggleFeatured: (id) => {
      const comps = loadFromStorage<Competition>(
        "pl_competitions",
        SEED_COMPETITIONS,
      );
      const updated = comps.map((c) =>
        c.id === id ? { ...c, featured: !c.featured } : c,
      );
      saveToStorage("pl_competitions", updated);
      set({ competitions: updated });
    },

    toggleActive: (id) => {
      const comps = loadFromStorage<Competition>(
        "pl_competitions",
        SEED_COMPETITIONS,
      );
      const updated = comps.map((c) =>
        c.id === id ? { ...c, active: !c.active } : c,
      );
      saveToStorage("pl_competitions", updated);
      set({ competitions: updated });
    },

    setEditingCompetition: (c) => set({ editingCompetition: c }),

    refreshFromStorage: () => {
      set({
        users: loadFromStorage<User>("pl_users", SEED_USERS),
        competitions: loadFromStorage<Competition>(
          "pl_competitions",
          SEED_COMPETITIONS,
        ),
        reviews: loadFromStorage<Review>("pl_reviews", SEED_REVIEWS),
        notifications: loadFromStorage<Notification>(
          "pl_notifications",
          SEED_NOTIFICATIONS,
        ),
      });
    },
  };
});
