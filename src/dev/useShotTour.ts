import { useEffect, useRef, useState } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import {
  consumePendingShot,
  getShot,
  peekPendingShot,
} from './shotTour';
import { QA_DRIVER_DEFAULT, QA_PASSENGER } from '../data/qaAccounts';

type Nav = NavigationContainerRef<Record<string, object | undefined>>;

/** Poll + role-change driven navigator for `shot/:id` deep links (dev screenshots). */
export function useShotTour(navigationRef: React.RefObject<Nav | null>) {
  const { userRole, bootstrapping, loginPassenger, loginDriver, logout } = useApp();
  const [tick, setTick] = useState(0);
  const busy = useRef(false);

  // Deep links may arrive while bootstrapping; poll briefly while a shot is pending.
  useEffect(() => {
    const t = setInterval(() => {
      if (peekPendingShot()) setTick((n) => n + 1);
    }, 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (bootstrapping || busy.current) return;
    const id = peekPendingShot();
    if (!id) return;
    const shot = getShot(id);
    if (!shot) {
      consumePendingShot();
      return;
    }

    let cancelled = false;

    (async () => {
      busy.current = true;
      try {
        const nav = navigationRef.current;
        if (!nav || cancelled) return;

        if (shot.role === 'guest') {
          if (userRole) {
            await logout();
            return; // keep pending; role change retriggers
          }
          consumePendingShot();
          if (shot.root) {
            nav.reset({ index: 0, routes: [{ name: shot.root }] });
          }
          return;
        }

        if (shot.role === 'passenger') {
          if (userRole === 'driver') {
            await logout();
            return;
          }
          if (userRole !== 'passenger') {
            const res = await loginPassenger(QA_PASSENGER.phone, QA_PASSENGER.password);
            if (!res.success) {
              console.warn('[shot]', id, res.error);
              consumePendingShot();
            }
            return;
          }
          consumePendingShot();
          const p = shot.passenger!;
          nav.navigate(
            'PassengerApp',
            p.screen
              ? { screen: p.tab, params: { screen: p.screen, params: p.params } }
              : { screen: p.tab }
          );
          return;
        }

        if (shot.role === 'driver') {
          if (userRole === 'passenger') {
            await logout();
            return;
          }
          if (userRole !== 'driver') {
            const res = await loginDriver(
              QA_DRIVER_DEFAULT.phone,
              QA_DRIVER_DEFAULT.password
            );
            if (!res.success) {
              console.warn('[shot]', id, res.error);
              consumePendingShot();
            }
            return;
          }
          consumePendingShot();
          const d = shot.driver!;
          nav.navigate(
            'DriverApp',
            d.screen
              ? { screen: d.tab, params: { screen: d.screen, params: d.params } }
              : { screen: d.tab }
          );
        }
      } finally {
        busy.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    tick,
    bootstrapping,
    userRole,
    loginPassenger,
    loginDriver,
    logout,
    navigationRef,
  ]);
}
