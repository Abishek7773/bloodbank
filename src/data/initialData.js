export const INITIAL_USERS = {
  hospital: [
    {
      username: "apollo",
      password: "pass",
      name: "Apollo Hospital",
      email: "apollo@hosp.in",
      phone: "+91 9876543210",
      city: "Trichy",
    },
  ],
  bank: [
    {
      username: "citybank",
      password: "pass",
      name: "City Central Blood Bank",
      email: "city@bank.in",
      phone: "+91 431 2345678",
      city: "Trichy",
    },
  ],
  donor: [
    {
      username: "ravi",
      password: "pass",
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      phone: "+91 9876500001",
      bloodType: "O+",
      city: "Trichy",
    },
  ],
};

export const INITIAL_BANKS = [
  {
    id: 1,
    name: "City Central Blood Bank",
    address: "123 Main Street, Trichy",
    phone: "+91 431 2345678",
    email: "city@bank.in",
    inventory: {
      "A+": 25, "A-": 10, "B+": 20, "B-": 8,
      "O+": 30, "O-": 15, "AB+": 12, "AB-": 5,
    },
    username: "citybank",
  },
  {
    id: 2,
    name: "Regional Medical Center Blood Bank",
    address: "456 Hospital Road, Trichy",
    phone: "+91 431 2345679",
    email: "regional@bank.in",
    inventory: {
      "A+": 18, "A-": 7, "B+": 22, "B-": 6,
      "O+": 27, "O-": 11, "AB+": 9, "AB-": 3,
    },
    username: "",
  },
];
