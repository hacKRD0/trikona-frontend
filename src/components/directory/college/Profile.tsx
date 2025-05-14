import React from 'react';
import { FaUniversity, FaMapMarkerAlt, FaUserGraduate, FaBook, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa';

export interface ProfileProps {
  logoUrl?: string;
  collegeName: string;
  location?: string;
  studentCount: number;
  programs?: number;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  foundedYear?: number;
  accreditations?: string[];
  admissionRate?: number;
}

const Profile: React.FC<ProfileProps> = ({
  logoUrl,
  collegeName,
  location,
  studentCount,
  programs,
  description,
  website,
  email,
  phone,
  foundedYear,
  accreditations,
  admissionRate,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-blue-50 h-40 flex items-center justify-center">
        <div className="relative -bottom-16 flex justify-center">
          <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={collegeName}
                className="h-full w-full object-contain"
              />
            ) : (
              <FaUniversity className="h-16 w-16 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 px-6 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{collegeName}</h1>
          {location && (
            <p className="text-lg text-gray-700 flex items-center justify-center mt-1">
              <FaMapMarkerAlt className="mr-1 text-gray-500" />
              {location}
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {description && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-900 mb-3">College Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaUserGraduate className="mr-2 text-gray-500" />
                  <span>Student Population: {studentCount}</span>
                </div>
                
                {programs !== undefined && (
                  <div className="flex items-center text-gray-700">
                    <FaBook className="mr-2 text-gray-500" />
                    <span>Programs: {programs}</span>
                  </div>
                )}
                
                {foundedYear && (
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2 text-gray-500">🏛️</span>
                    <span>Founded: {foundedYear}</span>
                  </div>
                )}
                
                {admissionRate !== undefined && (
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2 text-gray-500">📊</span>
                    <span>Admission Rate: {(admissionRate * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                {website && (
                  <div className="flex items-center text-gray-700">
                    <FaGlobe className="mr-2 text-gray-500" />
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                {email && (
                  <div className="flex items-center text-gray-700">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                )}
                
                {phone && (
                  <div className="flex items-center text-gray-700">
                    <FaPhone className="mr-2 text-gray-500" />
                    <a
                      href={`tel:${phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {accreditations && accreditations.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">Accreditations</h3>
              <div className="flex flex-wrap gap-2">
                {accreditations.map((accreditation) => (
                  <span 
                    key={accreditation} 
                    className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {accreditation}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
