import React from 'react';

function Members() {
  const members = [
    {
      id: 1,
      name: "Jane Hoper",
      role: "Leadership Coach",
      imageUrl: `${process.env.PUBLIC_URL}/images/Profile1.png`,
    },
    {
      id: 2,
      name: "Hoper King",
      role: "Leadership Coach",
      imageUrl: `${process.env.PUBLIC_URL}/images/Profile2.png`,
    },
    {
      id: 3,
      name: "Daniel Sheikh",
      role: "Leadership Coach",
      imageUrl: `${process.env.PUBLIC_URL}/images/Profile3.png`,
    },
    {
      id: 4,
      name: "Whilliam John",
      role: "Leadership Coach",
      imageUrl: `${process.env.PUBLIC_URL}/images/Profile4.png`,
    }
  ];

  return (
    <div className="p-8">
      <h2 className="text-white text-2xl font-semibold mb-4">Our Members</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-[#242424] rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold">{member.name}</h3>
                <p className="text-gray-400 text-sm">{member.role}</p>
              </div>
            </div>
            <button className="bg-[#6a55ea] text-white px-4 py-2 rounded-lg hover:bg-[#5242b6] transition duration-300">
              Contact
            </button>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center mt-5">
        <button className="text-[#6a55ea] hover:text-[#5242b6] bg-transparent ease-in-out transition duration-300 font-semibold text-lg">
            View All
        </button>
      </div>
    </div>
  );
}

export default Members;
