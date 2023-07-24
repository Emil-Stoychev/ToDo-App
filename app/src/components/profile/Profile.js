import { useRef } from 'react'
import styles from './profile.module.css'

const Profile = () => {
    const uploadImage = useRef(null)

    return (
        <div className={styles.main}>

            <div className={styles.top}>
                <div className={styles.image}>
                    <img onClick={() => uploadImage.current.click()} src='https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg' alt='profileImage' />
                    <input type='file' className='none' ref={(e) => uploadImage.current = e} />
                </div>

                <div className={styles.name}>
                    <h2>test</h2>

                    <div className={styles.followersAndFollowing}>
                        <h2>Followers: <span>7</span></h2>
                        <h2>Following: <span>4</span></h2>
                    </div>
                </div>
            </div>

            <hr className={styles.line} />

            <div className={styles.lastBtns}>
                <button className={styles.btnPrimary}>Follow</button>
                {/* <button className={styles.btnPrimary}>Unfollow</button> */}
            </div>


            <div className={styles.inputs}>
                <input type='email' disabled defaultValue='test@abv.bg' />
                <input type='password' placeholder='Your password' />
                <input type='password' placeholder='New password' />
            </div>

            <div className={styles.lastBtns}>
                <button className={styles.btnPrimary}>Edit</button>
                <button className={styles.btnPrimary1}>Delete</button>
            </div>

        </div>
    )
}

export default Profile