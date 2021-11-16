import { h, App } from 'vue';
import { AxiosError } from 'axios';

import Modal from '@/components/modal.vue';
import modalBus from './services/modals';

export function makeCenterStyle() {
  return {
    display: 'flex',
    flexFlow: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent'
  };
}

export function makeInitializerComponent(loadingComponent: any) {
  return h('div', { staticStyle: makeCenterStyle() }, [h(loadingComponent)]);
}

export async function handleError(e: Error, action?: string) {

  const message = (e as AxiosError).response?.data?.message || e.message || String(e);

  return modalBus.open({
    title: action ? 'Error ' + action : 'Error',
    message,
    type: 'danger',
    alert: true
  });
}
