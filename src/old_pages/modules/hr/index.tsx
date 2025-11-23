import React, { useState } from 'react';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  manager?: string;
  workSchedule: string;
  skills: string[];
  certifications: string[];
  performance: number;
  lastReview?: string;
  nextReview?: string;
}

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'absent';
}

const HRPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const employees: Employee[] = [
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Mukasa',
      email: 'jean.mukasa@pharmacie.cd',
      phone: '+243 99 123 4567',
      position: 'Pharmacien Responsable',
      department: 'Pharmacie',
      hireDate: '2020-03-15',
      salary: 1500000,
      status: 'active',
      workSchedule: 'Temps plein',
      skills: ['Conseil pharmaceutique', 'Gestion d\'équipe', 'Contrôle qualité'],
      certifications: ['Diplôme Pharmacien', 'Certification Qualité'],
      performance: 92,
      lastReview: '2024-12-15',
      nextReview: '2025-06-15'
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'Kabila',
      email: 'marie.kabila@pharmacie.cd',
      phone: '+243 97 234 5678',
      position: 'Pharmacienne',
      department: 'Pharmacie',
      hireDate: '2021-08-10',
      salary: 1200000,
      status: 'active',
      manager: 'Jean Mukasa',
      workSchedule: 'Temps plein',
      skills: ['Prescription', 'Conseil client', 'Formation'],
      certifications: ['Diplôme Pharmacien'],
      performance: 88,
      lastReview: '2024-11-20',
      nextReview: '2025-05-20'
    },
    {
      id: '3',
      firstName: 'Paul',
      lastName: 'Tshikala',
      email: 'paul.tshikala@pharmacie.cd',
      phone: '+243 98 345 6789',
      position: 'Caissier',
      department: 'Vente',
      hireDate: '2022-01-20',
      salary: 800000,
      status: 'active',
      manager: 'Jean Mukasa',
      workSchedule: 'Temps plein',
      skills: ['Caisse', 'Relation client', 'Inventory'],
      certifications: ['Formation Caisse'],
      performance: 85
    },
    {
      id: '4',
      firstName: 'Grace',
      lastName: 'Mbuyi',
      email: 'grace.mbuyi@pharmacie.cd',
      phone: '+243 99 456 7890',
      position: 'Technicienne',
      department: 'Logistique',
      hireDate: '2023-05-12',
      salary: 750000,
      status: 'on_leave',
      manager: 'Jean Mukasa',
      workSchedule: 'Temps plein',
      skills: ['Gestion stocks', 'Réception', 'Contrôle'],
      certifications: ['Formation Logistique'],
      performance: 78
    }
  ];

  const schedules: Schedule[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Jean Mukasa',
      date: '2025-01-22',
      shift: 'morning',
      startTime: '08:00',
      endTime: '16:00',
      status: 'confirmed'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Marie Kabila',
      date: '2025-01-22',
      shift: 'afternoon',
      startTime: '12:00',
      endTime: '20:00',
      status: 'confirmed'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Paul Tshikala',
      date: '2025-01-22',
      shift: 'morning',
      startTime: '08:00',
      endTime: '16:00',
      status: 'scheduled'
    }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'on_leave': return 'En congé';
      default: return 'Inconnu';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const departments = ['all', 'Pharmacie', 'Vente', 'Logistique', 'Administration'];

  const stats = [
    {
      title: 'Total Employés',
      value: employees.length.toString(),
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Employés Actifs',
      value: employees.filter(e => e.status === 'active').length.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'En Congé',
      value: employees.filter(e => e.status === 'on_leave').length.toString(),
      icon: CalendarDaysIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Performance Moyenne',
      value: Math.round(employees.reduce((sum, e) => sum + (e.performance || 0), 0) / employees.length) + '%',
      icon: ChartBarIcon,
      color: 'bg-cyan-500'
    }
  ];

  return (
    <Layout title="Ressources Humaines">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ressources Humaines</h1>
            <p className="text-gray-600">Gestion du personnel et planification</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              Planning
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvel Employé
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'employees', label: 'Employés', icon: UserGroupIcon },
              { id: 'schedule', label: 'Planning', icon: CalendarDaysIcon },
              { id: 'performance', label: 'Performance', icon: ChartBarIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'employees' && (
          <>
            {/* Filtres et recherche */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'Tous les départements' : dept}
                    </option>
                  ))}
                </select>

                <Button variant="outline">
                  Exporter Liste
                </Button>
              </div>
            </Card>

            {/* Liste des employés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                          {getStatusText(employee.status)}
                        </span>
                        {employee.performance && (
                          <span className={`ml-2 text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                            Performance: {employee.performance}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      {employee.workSchedule}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      Embauché le {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      Salaire: {employee.salary.toLocaleString()} FC/mois
                    </div>
                  </div>

                  {/* Compétences */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Compétences</h4>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{employee.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {employee.certifications.map((cert, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                          <AcademicCapIcon className="h-3 w-3 mr-1" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Évaluations */}
                  {employee.lastReview && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Dernière évaluation:</span>
                        <span className="font-medium">
                          {new Date(employee.lastReview).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {employee.nextReview && (
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>Prochaine évaluation:</span>
                          <span>{new Date(employee.nextReview).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="primary" className="flex-1">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'schedule' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Planning de la Semaine</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horaires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {schedule.employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(schedule.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          schedule.shift === 'morning' ? 'bg-yellow-100 text-yellow-800' :
                          schedule.shift === 'afternoon' ? 'bg-blue-100 text-blue-800' :
                          'bg-cyan-100 text-cyan-800'
                        }`}>
                          {schedule.shift === 'morning' ? 'Matin' :
                           schedule.shift === 'afternoon' ? 'Après-midi' : 'Nuit'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          schedule.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          schedule.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {schedule.status === 'confirmed' ? 'Confirmé' :
                           schedule.status === 'scheduled' ? 'Planifié' :
                           schedule.status === 'completed' ? 'Terminé' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évaluations de Performance</h3>
              <div className="space-y-4">
                {employees
                  .filter(e => e.performance)
                  .sort((a, b) => (b.performance || 0) - (a.performance || 0))
                  .map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{employee.position}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getPerformanceColor(employee.performance || 0)}`}>
                          {employee.performance}%
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              (employee.performance || 0) >= 90 ? 'bg-green-600' :
                              (employee.performance || 0) >= 80 ? 'bg-blue-600' :
                              (employee.performance || 0) >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${employee.performance || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évaluations Programmées</h3>
              <div className="space-y-3">
                {employees
                  .filter(e => e.nextReview)
                  .sort((a, b) => new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime())
                  .map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{employee.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(employee.nextReview!).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {Math.ceil((new Date(employee.nextReview!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HRPage;