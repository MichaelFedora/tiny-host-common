import { CreateElement, PluginObject } from 'vue';
import { AxiosError } from 'axios';
// @ts-ignore
import Modal from './components/modal.vue';

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

export function makeInitializerComponent(h: CreateElement, loadingComponent: any) {
  return h('div', { staticStyle: makeCenterStyle() }, [h(loadingComponent)]);
}

export let VueInstance: typeof window.Vue;

export const use = (plugin) => {
  if(typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
  }
}

export const registerComponent = (Vue, component) => {
  Vue.component(component.name, component);
}

let localVueInstance: typeof window.Vue;

export async function openModal<T = any>(options: {
  title: string,
  message: string,
  type?: '' | 'primary' | 'success' | 'warning' | 'danger' | 'info',
  alert?: boolean,
  prompt?: { type?: string, placeholder?: string, required?: boolean, readonly?: boolean, value?: string | number }
}) {

  const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : localVueInstance || VueInstance;
  const ModalComponent = vm.extend(Modal);

  const div = document.createElement('div');
  document.body.append(div);

  const component = new ModalComponent({
    el: div,
    propsData: options
  });

  return new Promise<T>(res => {
    component.$on('confirm', (event: T) => { res(event); });
    component.$on('cancel', () => res(undefined));
  });
}
export async function openCustomModal<T = any>(modal: any, propsData?: any) {

  const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : localVueInstance || VueInstance;
  const ModalComponent = vm.extend(modal);

  const div = document.createElement('div');
  document.body.append(div);

  const component = new ModalComponent({
    el: div,
    propsData
  });

  return new Promise<T>(res => {
    component.$on('confirm', (event: T) => { res(event); });
    component.$on('cancel', () => res(undefined));
  });
}

export async function handleError(e: Error, action?: string) {

  const message = (e as AxiosError).response?.data?.message || e.message || String(e);

  return openModal({
    title: action ? 'Error ' + action : 'Error',
    message,
    type: 'danger',
    alert: true
  });
}

export const UtilityPlugin: PluginObject<any> = {
  install(Vue: any) {
    localVueInstance = Vue
  }
}

export default UtilityPlugin;
