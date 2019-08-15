// From https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66

import {IUser} from './App'

function openNewAuthWindow(myUrl: string): Promise<IUser> {
    // Open the new window
    const authWindow: Window = window.open(myUrl, '_blank') as Window;

    // listen for messages from authWindow
    const authPromise: Promise<IUser> = new Promise((resolve, reject) => {
        window.addEventListener('message', (msg) => {
            if (!msg.origin.includes(`${window.location.protocol}//${window.location.host}`)) {
                authWindow.close();
                reject('Not allowed')
            }
            if (msg.data.payload) {
                try {
                    resolve(JSON.parse(msg.data.payload))
                }
                catch (e) {
                    resolve(msg.data.payload)
                }
                finally {
                    authWindow.close()
                }
            } else {
                authWindow.close();
                reject('Unauthorized')
            }
        }, false)
    })
    return authPromise;
}

export default openNewAuthWindow