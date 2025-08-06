### Vercel Configuration Steps

This guide assumes you already have a single Vercel project set up from your Next.js GitHub repository. The goal is to point all of your project subdomains to this one Vercel deployment.

#### **Step 1: Open Your Vercel Project Dashboard**

1.  Navigate to your Vercel Dashboard.
    
2.  Select the Vercel project that is connected to your Next.js GitHub repository. This is the **only Vercel project** you will need for all your sites.
    

#### **Step 2: Add Your Custom Domains**

1.  In the project dashboard, go to the **"Settings"** tab.
    
2.  In the left sidebar, click on **"Domains"**.
    
3.  You will see the domain for your Vercel project (e.g., `my-next-project.vercel.app`).
    
4.  In the input field, enter each of your project subdomains one by one and click **"Add"**:
    
    *   `csr-meai.distincthorizon.net`
        
    *   `csr-aai.distincthorizon.net`
        
    *   `csr-irctc.distincthorizon.net`
        
5.  After adding each subdomain, Vercel will prompt you to configure the DNS records. Do not close this tab.
    

#### **Step 3: Configure DNS Records at Your Domain Registrar**

This is the most critical step. You need to create DNS records for each of your subdomains at your domain registrar (`distincthorizon.net`).

1.  Log in to your domain registrar's account (e.g., GoDaddy, Namecheap, Cloudflare, etc.).
    
2.  Find the DNS management section for your domain `distincthorizon.net`.
    
3.  For each subdomain, you will need to add a **CNAME** record:
    
    *   **Type:** CNAME
        
    *   **Host/Name:** `csr-meai`
        
    *   **Value/Target:** `cname.vercel-dns.com`
        
    *   **TTL:** Automatic or 3600 (1 hour)
        
4.  Repeat this process for every subdomain:
    
    *   **Host/Name:** `csr-aai`
        
    *   **Value/Target:** `cname.vercel-dns.com`
        
    *   **Host/Name:** `csr-irctc`
        
    *   **Value/Target:** `cname.vercel-dns.com`
        
5.  After saving the DNS records, go back to your Vercel dashboard. Vercel will automatically verify the records. This process may take a few minutes. Once verified, you will see a green checkmark next to each domain.
    

#### **Step 4: Confirm and Deploy**

*   Once the domains are verified, Vercel will automatically route traffic from `https://csr-meai.distincthorizon.net` and your other subdomains to your single Next.js project.
    
*   When a user visits any of these subdomains, your Next.js `middleware.js` will execute, detect the hostname, and dynamically serve the correct project data.
    
*   Any time you push changes to your GitHub repository, Vercel will deploy a new version that automatically updates all of your projects at once.
    

This single setup eliminates the need for separate Vercel projects for each subdomain, allowing you to maintain a single codebase and deployment for all your client sites.

---

### **Local Testing and Verification**

You cannot test subdomains directly on `localhost`, but you can verify that the multi-tenant setup is working correctly by simulating the middleware's behavior.

1.  **Start the local development server:**
    ```bash
    npm run dev
    ```

2.  **Test each project in your browser:**
    Once the server is running (usually at `http://localhost:3000`), open your browser and test each project by manually adding the `projectHostname` query parameter to the URL. This mimics what the middleware does in production.

    *   **MEAI Project:**
        [http://localhost:3000/project?projectHostname=csr-meai.distincthorizon.net](http://localhost:3000/project?projectHostname=csr-meai.distincthorizon.net)

    *   **AAI Project:**
        [http://localhost:3000/project?projectHostname=csr-aai.distincthorizon.net](http://localhost:3000/project?projectHostname=csr-aai.distincthorizon.net)

    *   **IRCTC Project:**
        [http://localhost:3000/project?projectHostname=csr-irctc.distincthorizon.net](http://localhost:3000/project?projectHostname=csr-irctc.distincthorizon.net)

    When you visit each of these URLs, the page should render the specific `name`, `location`, and data associated with that project from your `projects.json` file.
