export default function ({ store, redirect }) {
    // ユーザーが認証されていないとき
  if (store.state.first == false) {
    return redirect('/')
  }
}