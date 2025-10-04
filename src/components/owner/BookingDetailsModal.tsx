'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarIcon, UserCircleIcon, EnvelopeIcon, TagIcon } from '@heroicons/react/24/outline';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any; // FullCalendar event object
}

export default function BookingDetailsModal({ isOpen, onClose, event }: BookingDetailsModalProps) {
  if (!event) return null;

  const { extendedProps, start, end } = event;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                  Szczegóły rezerwacji
                </Dialog.Title>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><span className="font-medium">Pokój:</span> {extendedProps.roomName}</p>
                  </div>
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><span className="font-medium">Klient:</span> {extendedProps.userName}</p>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><span className="font-medium">Email:</span> {extendedProps.userEmail}</p>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><span className="font-medium">Status:</span> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${extendedProps.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{extendedProps.status}</span></p>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-600"><span className="font-medium">Początek:</span> {new Date(start).toLocaleString('pl-PL')}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Koniec:</span> {new Date(end).toLocaleString('pl-PL')}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Zamknij
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
